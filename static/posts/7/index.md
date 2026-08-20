---
title: CI로 생성된 Playwright 테스트 보고서 쉽고 빠르게 확인하기
publicationDate: 2025-10-10
preview: ./preview.png
summary: >
  Playwright HTML 테스트 보고서를 브라우저에서 쉽고 빠르게 확인하기
tags:
  - AWS CloudFront
  - AWS S3
  - GitHub Actions
  - Playwright
  - Pulumi
---

여러 작은 사이드 프로젝트를 하다 보면 테스트 환경 구성에 많은 시간을 투자하곤 합니다. TDD(테스트 주도 개발)를 엄격히 따르는 편은 아니지만, 여러 프로젝트를 병렬로 다루다 보니 언제든 다시 작업을 이어갈 수 있는 개발 환경을 갖추는 것이 특히 중요합니다.

프로젝트에 기능에 UI가 포함되는 경우에는 종단 간 테스트를 위해 Playwright를 이용하고 있습니다. 하지만 매번 GitHub에서 테스트 결과를 직접 확인하는 것은 꽤 불편하게 느껴졌습니다. 워크플로 아티팩트를 다운로드하는 대신, PR에서 링크를 열고 바로 HTML 테스트 보고서를 확인할 수 있으면 좋겠다고 생각했습니다.

이번에는 AWS S3와 CloudFront를 활용하여 Playwright 테스트 리포트를 브라우저에서 한 번의 클릭으로 즉시 확인하는 간단한 워크플로를 소개합니다.

## 🎭 Playwright

[Playwright](https://playwright.dev/)는 Microsoft에서 관리하는 오픈소스 E2E 테스트 프레임워크입니다. 다양한 브라우저 및 플랫폼, 프로그래밍 언어 지원 등으로 많은 인기를 끌고 있습니다. 또한 웹 스크래핑에 사용하는 사례도 쉽게 확인할 수 있습니다.

![Playwright](./assets/playwright-demo.png)

Playwright를 선택하게 된 데에는 다음과 같은 이유가 있습니다:

- 브라우저 및 시스템 의존성 설치를 자동으로 처리해 줍니다. 설치 및 실행이 간단하며, 공식 Docker 이미지도 제공되어 CI 환경에서 쉽게 활용할 수 있습니다.
- 브라우저 UI 및 다양한 확장(VS Code Extension, MCP, CLI)을 지원하며 좋은 사용 경험을 제공합니다.
- 공식 문서가 잘 관리되어 있으며 생태계가 활발합니다. 참고할 수 있는 글과 문서가 굉장히 풍부하며 Microsoft에서 관리하므로 안정적으로 유지보수됩니다.

## 🪣 임시 웹 호스팅

Playwright HTML 보고서를 번거로운 다운로드 과정 없이 브라우저에서 바로 열람하려면 간단한 정적 웹 호스팅 환경이 필요합니다. 임시 호스팅 구성이 단순해야 하고, 여러 PR에서 생성된 보고서를 독립적으로 확인할 수 있어야 합니다. 또한 오래된 리포트를 자동으로 만료시킬 수 있다면 관리 및 비용 부담을 크게 줄일 수 있습니다.

이 모두를 만족하는 가장 가성비 좋은 솔루션은 AWS S3와 CloudFront입니다.

- S3 라이프사이클 규칙을 통해 오래된 보고서는 자동으로 삭제할 수 있어 비용 발생을 최소화할 수 있습니다.
- S3 버킷을 외부에 직접 공개하지 않고 CloudFront와 OAC(Origin Access Control)를 통해 접근하도록 구성하여 S3를 향한 비인가 접근이나 직접 공격을 사전에 효과적으로 차단할 수 있습니다.
- CloudFront 정액 요금제(Flat Rate Pricing, [2025년 11월에 출시](https://aws.amazon.com/ko/blogs/korea/introducing-flat-rate-pricing-plans-with-no-overages/))를 이용하면 과도한 요금 발생을 막을 수 있습니다. 주의해야 할 점은, 정액 요금제로 전환한 CloudFront 인스턴스는 기존 종량 요금제로 전환해야 삭제할 수 있습니다.

> 🤔 **다른 정적 호스팅 서비스(GitHub Pages, Cloudflare Pages)와의 비교**
>
> - **GitHub Pages:** 배포 브랜치에 매번 테스트 리포트 빌드 결과물을 커밋해야 하므로, 수많은 PR과 커밋으로 인해 Git 히스토리가 난잡해지고 저장소 용량이 급격히 비대해집니다.
> - **Cloudflare Pages:** PR별 Preview 배포를 지원하지만, S3 수명 주기 규칙(Lifecycle)과 비슷한 기능을 지원하지 않습니다. 또한 별도의 배포 CLI(Wrangler)나 계정 관리 없이, `aws s3 cp` 한 줄로 디렉토리 구조(`playwright-report-${{ github.run_id }}`)를 직접 제어하고 기존 AWS/Pulumi 단일 스택에서 인프라를 통합 관리하는 것이 훨씬 직관적이고 여러 프로젝트에 재사용하기 수월했습니다.

### 📜 Pulumi 인프라 정의

앞으로 여러 프로젝트에서 동일한 구성을 재사용할 수 있도록 Pulumi를 사용해 인프라를 코드(IaC)로 정의했습니다.

```python
import pulumi_aws as aws
from pulumi import Output

bucket = aws.s3.Bucket(
   "playwright-reports",
   bucket_prefix="playwright-reports-",
   force_destroy=True,
)
public_access_block = aws.s3.BucketPublicAccessBlock(
   "playwright-reports",
   bucket=bucket.id,
   block_public_acls=True,
   block_public_policy=True,
   ignore_public_acls=True,
   restrict_public_buckets=True,
)
ownership_control = aws.s3.BucketOwnershipControls(
   "playwright-reports",
   bucket=bucket.id,
   rule={
       "object_ownership": "BucketOwnerEnforced",
   },
)
aws.s3.BucketLifecycleConfiguration(
   "playwright-reports",
   bucket=bucket.id,
   rules=[
       {
           "id": "Expire reports older than 7 days",
           "status": "Enabled",
           "expiration": {
               "days": 7,
           },
       },
   ],
)

_oac = aws.cloudfront.OriginAccessControl(
   "playwright-reports",
   description="OAC for public assets",
   origin_access_control_origin_type="s3",
   signing_behavior="always",
   signing_protocol="sigv4",
)
_target_origin_id = Output.format("s3-{bucket}", bucket=bucket.bucket)
# TODO: CloudFront flat-rate plans: https://github.com/hashicorp/terraform-provider-aws/issues/45450
cdn = aws.cloudfront.Distribution(
   "playwright-reports",
   enabled=True,
   comment=bucket.id,
   origins=[
       {
           "domain_name": bucket.bucket_regional_domain_name,
           "origin_id": _target_origin_id,
           "origin_access_control_id": _oac.id,
       },
   ],
   default_cache_behavior={
       "target_origin_id": _target_origin_id,
       "allowed_methods": ["GET", "HEAD", "OPTIONS"],
       "cached_methods": ["GET", "HEAD"],
       "cache_policy_id": "658327ea-f89d-4fab-a63d-7e88639e58f6",  # CachingOptimized
       "origin_request_policy_id": "88a5eaf4-2fd4-4709-b370-b4c650ea3fcf",  # CORS-S3Origin
       "response_headers_policy_id": "60669652-455b-4ae9-85a4-c4c02393f86c",  # SimpleCORS
       "viewer_protocol_policy": "redirect-to-https",
   },
   restrictions={
       "geo_restriction": {
           "restriction_type": "none",
       },
   },
   viewer_certificate={
       "cloudfront_default_certificate": True,
   },
   wait_for_deployment=False,
   tags={
       "Name": bucket.id,
   },
)
aws.s3.BucketPolicy(
   "playwright-reports",
   bucket=bucket.id,
   policy=aws.iam.get_policy_document(
       statements=[
           {
               "sid": "AllowCloudFrontServicePrincipalReadOnly",
               "actions": ["s3:GetObject"],
               "resources": [Output.concat(bucket.arn, "/*")],
               "principals": [
                   {
                       "type": "Service",
                       "identifiers": ["cloudfront.amazonaws.com"],
                   },
               ],
               "conditions": [
                   {
                       "test": "StringEquals",
                       "variable": "AWS:SourceArn",
                       "values": [cdn.arn],
                   },
               ],
           },
       ],
   ).json,
)
aws.s3.BucketCorsConfiguration(
   "playwright-reports",
   bucket=bucket.id,
   cors_rules=[
       {
           "id": "AllowAll",
           "allowed_methods": ["GET"],
           "allowed_headers": ["*"],
           "allowed_origins": ["*"],
           "expose_headers": [],
           "max_age_seconds": 3_000,
       },
   ],
)
```

이 외에도 GitHub Actions 변수 자원을 관리하는 코드가 있어 GitHub Actions 환경으로 변수 및 비밀값 삽입 또한 Pulumi에서 처리하고 있습니다. AWS 인프라에 인증하기 위한 OIDC 구성 등도 Pulumi에서 관리하고 있습니다.

### ⚙️ Playwright HTML 리포트 생성하기

테스트 후 HTML 리포트를 생성하도록 Playwright 설정을 갱신해야 할 필요가 있습니다. `$.reporter` 설정을 변경하여 HTML 리포트를 생성하도록 해줍니다.

```javascript
{
  // ...
  reporter: [
    ['list'],
    [
      'html',
      {
        open: process.env.CI ? 'never' : 'on-failure',
        host: process.env.CONTAINER ? '0.0.0.0' : '127.0.0.1'
      }
    ],
    ['junit', { outputFile: 'junit.xml' }]
  ],
  // ...
}
```

생성된 리포트는 `playwright-report/` 디렉토리에 저장됩니다. 남은 것은 이 디렉토리를 S3에 업로드하는 것뿐입니다.

### 📰 테스트 리포트 업로드하기

이제 CI 워크플로를 작성하여 HTML 리포트를 S3에 업로드하고, [thollander/actions-comment-pull-request](https://github.com/thollander/actions-comment-pull-request) 액션을 이용해 PR에 접근 링크가 담긴 댓글을 남깁니다. 장기 AWS 자격 증명(Access Key)을 시크릿에 저장하지 않고 [AWS OIDC](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws)를 통해 안전하게 임시 인증 정보를 발급받아 업로드하며, 업로드 권한 역시 최소 권한 원칙에 따라 필요한 S3 경로에만 제한적으로 부여했습니다.

```yaml
steps:
  # ...

  - name: Configure AWS credentials
    uses: aws-actions/configure-aws-credentials@ec61189d14ec14c8efccab744f656cffd0e33f37 # v6
    with:
      aws-region: ${{ vars.AWS_REGION }}
      role-to-assume: ${{ secrets.AWS_ROLE_TO_ASSUME }}

  # ... Set up and run Playwright tests

  - name: Upload Playwright report to GitHub
    uses: actions/upload-artifact@bbbca2ddaa5d8feaa63e36b76fdaad77386f024f # v7
    if: always()
    with:
      name: playwright-artifacts
      path: |
        e2e/playwright-report/
        e2e/test-results/
        e2e/run-*.log
      retention-days: 7

  - name: Upload Playwright report to S3
    id: upload-playwright-report-s3
    if: always()
    env:
      PLAYWRIGHT_REPORT_S3_PREFIX: playwright-report-${{ github.run_id }}
    run: |
      aws s3 cp --recursive \
        e2e/playwright-report/ \
        "s3://${{ vars.PLAYWRIGHT_REPORTS_BUCKET }}/${{ env.PLAYWRIGHT_REPORT_S3_PREFIX }}/"

      report_index_url="https://${{ vars.PLAYWRIGHT_REPORTS_CDN }}/${{ env.PLAYWRIGHT_REPORT_S3_PREFIX }}/index.html"
      cat <<EOF | tee ./playwright-report.md $GITHUB_STEP_SUMMARY
      📊 Playwright test report is now available at [here](${report_index_url})
      EOF

  - name: Comment on PR
    uses: thollander/actions-comment-pull-request@24bffb9b452ba05a4f3f77933840a6a841d1b32b # v3
    if: always() && steps.upload-playwright-report-s3.outcome == 'success' && github.event_name == 'pull_request'
    with:
      comment-tag: playwright-report
      file-path: ./playwright-report.md
```

테스트가 완료되면 PR에 댓글이 달립니다. `comment-tag: playwright-report` 옵션 덕분에 새로운 커밋이 푸시될 때마다 기존 댓글이 최신 링크로 깔끔하게 갱신되어 PR이 댓글로 도배되지 않습니다. 이로 인해 이전 커밋의 리포트 링크를 PR 댓글에서 바로 누를 수는 없다는 단점은 있지만, 워크플로에서 `$GITHUB_STEP_SUMMARY`에도 함께 출력해 두었으므로 특정 워크플로의 GitHub Actions Job Summary 탭으로 이동하면 해당 커밋 시점의 리포트를 언제든지 확인할 수 있습니다.

![PR 테스트 결과 댓글](./assets/pr-comment.png)

링크를 클릭하면 보고서를 바로 확인할 수 있습니다. 테스트 케이스의 상세 내용 또한 확인할 수 있습니다.

![테스트 케이스 상세 결과](./assets/test-case-detail.png)

실패한 테스트 케이스의 트레이스(Trace) zip 파일을 로컬로 다운로드받아 [Playwright Trace Viewer](https://trace.playwright.dev/)에 다시 수동 업로드할 필요 없이, 브라우저에서 버튼 클릭 한 번으로 액션 타임라인, 네트워크 로그, DOM 스냅샷을 즉시 브라우저에서 확인할 수 있습니다.

![Playwright 트레이스](./assets/playwright-trace.png)

## 🤔 아쉬운 점

- **접근 제어 및 보안 (오픈소스 vs 프라이빗)**

  현재 구성은 누구나 접근 가능한 공개(Public) 리포지토리를 전제로 하고 있습니다. 만약 내부 API 엔드포인트나 민감한 에러 스택이 포함될 수 있는 비공개(Private) 프로젝트라면 CloudFront Signed Cookies 등을 도입해 인가된 사용자만 리포트를 열람할 수 있도록 개선해야 합니다. 현재 이 보안 문제를 해결하기 위한 후속 인프라 설계를 사이드 프로젝트로 진행 중입니다.

- **프로젝트별 워크플로 및 권한 관리**

  Playwright를 필요로 하는 프로젝트마다 워크플로를 각자 구성해야 하고, 워크플로에 AWS 접근 권한을 부여해야 하며, 프로젝트별로 인프라 리소스를 각각 관리해야 합니다. 그래서 GitHub App이나 커스텀 GitHub Action을 만들어서 여러 프로젝트에서 재사용하는 방식을 고려하고 있습니다.

- **스냅샷 갱신 및 환경 일치**

  PR에서 스냅샷을 손쉽게 업데이트할 수 있는 워크플로가 추가되면 더 편리할 것 같습니다. 또한 로컬(Docker)과 CI 환경 사이의 실행 속도 및 환경 불일치 해소도 남아있는 과제입니다.

## 💭 마치며

간단한 파이프라인 구성만으로도 Playwright 테스트 결과와 트레이스를 브라우저에서 즉시 확인할 수 있게 되어 작업 편의성이 크게 향상되었습니다. 또한 S3 라이프사이클을 통해 오래된 보고서가 자동으로 정리되므로 불필요한 스토리지 비용 발생도 사전에 방지할 수 있습니다.

다만 프로젝트별 개별 구성에 따른 재사용성 한계와 비공개 프로젝트를 위한 접근 제어는 여전히 발전시킬 여지가 남아있습니다. 다음에는 여러 프로젝트에 손쉽게 붙여 쓸 수 있는 재사용 가능한 커스텀 GitHub Action과 CloudFront Signed Cookies를 활용한 보안 호스팅을 구축하여 글로 정리해보려 합니다.

## 🔗 참고한 글

- [https://afsalbacker.medium.com/access-playwright-trace-viewer-reports-online-via-amazon-s3-51fd365d80f6](https://afsalbacker.medium.com/access-playwright-trace-viewer-reports-online-via-amazon-s3-51fd365d80f6)
- [https://medium.com/@haleywardo/streamlining-playwright-visual-regression-testing-with-github-actions-e077fd33c27c](https://medium.com/@haleywardo/streamlining-playwright-visual-regression-testing-with-github-actions-e077fd33c27c)
