---
title: Django로 블로그 다시 만들기
series: 기술 블로그 운영하기
publicationDate: 2025-10-10
preview: ./preview.png
summary: >
  SvelteKit으로 만들었던 정적 웹 블로그를 Django로 완전히 다시 만든 이유
tags:
  - AWS CloudFront
  - AWS S3
  - Django
  - Pulumi
  - Python
  - Railway
---

이전에 블로그를 SvelteKit으로 만든 적이 있습니다. SvelteKit으로 작성한 마크다운 기반 블로그로, 처음에는 GitHub Pages에 배포하여 운영했었죠. 나중에는 Cloudflare Workers로 옮겨가며 이런저런 실험도 하고 추가 기능도 구현해 나갔었지만, 점차 정적 웹 페이지의 한계 및 불편함으로 전환을 계속 고려하고 있었습니다.

그리고 이번에 블로그를 Django로 완전히 다시 작성하게 되어 그 경험을 공유하려고 합니다.

## 🤔 문제점들

제게 전문적인 프론트엔드 개발 경험은 없습니다. 개인 프로젝트를 조금씩 해온 게 다고 여지껏 일정 규모 이상을 넘어가지 않았습니다. 매번 프론트엔드 개발은 제게 여러 곤혹을 가져다주었는데,

- 익숙하지 않은 생태계

  대부분의 시간을 저는 Python 관련 사이드 프로젝트에 할애했고, 간간히 Rust를 배워나가려고 하는 입장이었습니다. 처음에는 TypeScript를 배우고 싶어서 시작했지만 제가 프론트엔드 개발 그 자체에 별다른 흥미를 느끼지 못한다는 걸 알게 된 이후로는 순전히 부담으로 다가왔습니다.

- 너무도 잦은 변화

  의존성 패키지의 변경 주기가 굉장히 짧았습니다. 매달 Dependabot은 한 프로젝트에서만 10개 남짓한 패키지 업데이트 PR을 뿜어냈는데, 취약점 패치부터 메이저 버전 업그레이드(Svelte, SvelteKit, ESLint, Tailwind, &hellip;)까지 다양했습니다.

  제게는 이것이 생태계의 역동성이라기보다는 불안정성으로 느껴졌습니다.

- 불편한 컨텐츠 에디터

  정적 웹 페이지로 마크다운 블로그를 만드는 건 꽤 재밌는 일이었지만, 실제로 글을 VS Code에서 작성하고 관리하는 건 굉장히 불편했습니다. 매번 로컬 서버를 열어서 실제 렌더링 결과를 확인해야 했습니다.

정적 웹 사이트 이상의 무언가를 하려면 결국 비용이 발생하게 됩니다. Cloudflare Workers는 무료 사용자에게 10ms로 제한된 CPU 시간을 제공합니다. 간단한 작업에는 괜찮겠지만, 머잖아 걸림돌이 될 것이 뻔했습니다. 

결국 비용을 지출해야 한다면 서버가 있는 편이 훨씬 낫겠다는 결론에 도달했습니다. 하지만 Node.js 환경을 그대로 이용하기보단 제게 가장 익숙한 Python 환경을 원했고, 서비스 규모가 굉장히 작으니 비용 또한 최소화하길 바랐습니다.

## 🧰 테크 스택

다음과 같은 스택을 구상했습니다.

| 항목                              | 선택 기술                                  |
| --------------------------------- | ------------------------------------------ |
| 프로그래밍 언어                   | Python 3                                   |
| 프레임워크                        | Django                                     |
| 배포 환경                         | Railway                                    |
| 데이터베이스                      | PostgreSQL                                 |
| 정적 / 미디어 파일 관리 및 호스팅 | S3 + CloudFront                            |
| CI/CD                             | GitHub Actions                             |
| 그 외                             | Tailwind CSS, DaisyUI, HTMX,  Pulumi, etc. |

크게 특별할 것 없는 Django 기반 웹 프로젝트 구성입니다.

- 별도의 분리된 FE 구성을 원하지는 않았지만, Tailwind를 이용하기 위해 결국 프로젝트 내에 Node 프로젝트를 구성하게 되었습니다. 기존 블로그가 Tailwind + DaisyUI를 이용하고 있었기에, 이번 마이그레이션 작업의 규모를 줄이기 위해 가능한 한 많은 코드를 재사용하고자 했습니다.

- 배포 환경은 기존 Cloudflare Workers에서 Railway로 옮겼습니다. Railway는 몇개월 전 우연히 접하게 된 이후 계속 눈여겨 보고 있었는데, 이번에 써볼만한 명분(?)이 생긴 셈입니다.

- 정적 파일 호스팅은 AWS S3와 CloudFront를 활용했습니다. S3만 이용할 수도 있지만 최근 들어 DoW (Denial of Wallet) 피해 사례를 자주 접하게 되면서 최소한의 보호 계층을 추가하고자 했습니다.

- 인프라 리소스는 별도의 코드 저장소에서 Pulumi를 활용하여 관리하고 있습니다. 블로그 외에도 제 개인 프로젝트 전반의 인프라를 관리하는 곳입니다.

## 🏗️ 컨텐츠 에디터

이번 전환에서 가장 중요한 건 블로그 글 작성과 관리가 용이해야 한다는 것이었습니다. 작성과 수정, 게시 / 비공개 전환 등 필요한 기능을 쉽게 만들고 필요하다면 추가할 수 있어야 했습니다. 그리고 Django 어드민을 최대한 활용하여 불필요한 코드 작성을 최소화해야 했습니다.

어드민 기능 확장과 커스터마이징에는 [django-unfold](https://github.com/unfoldadmin/django-unfold)를 적극적으로 활용했습니다. Unfold는 Django 어드민을 사용하면서 한 번쯤 필요했던 기능들이 대거 포함되어 있습니다.

- 동작 환경, 언어 및 테마 선택

  ![Django 관리자 커스터마이징](./assets/django-admin-theme.png)

- 쉽게 커스터마이징 가능한 사이드바

  ![커스터마이징 가능한 사이드바](./assets/sidebar-customization.png)

- 커맨드 기능

  ![커맨드 기능](./assets/command-feature.png)

이 외에도 `ImageField` 미리보기, 탭, 색상 선택 및 WYSIWYG 위젯 등, 기능이 너무도 많아 모두 설명할 수는 없지만 작은 Django 어드민 라이브러리 10 ~ 20개 분량의 기능은 포함하고 있습니다. 또한 유명한 여러 라이브러리([django-import-export](https://github.com/django-import-export/django-import-export), [django-constance](https://github.com/jazzband/django-constance), [django-celery-beat](https://github.com/celery/django-celery-beat) 등)에 대한 지원도 포함합니다.

### ✏️ 블로그 글 작성 및 관리

블로그 글 작성과 관리를 위해 WYSIWYG 에디터로 [TinyMCE](https://www.tiny.cloud/) ([django-tinymce](https://github.com/jazzband/django-tinymce))를 선택했습니다. 정적 및 미디어(첨부 파일, 이미지 등) 파일은 S3에 저장하고, CloudFront를 통해 제공합니다.

![TinyMCE 에디터](./assets/tinymce-editor.png)

포스트의 첨부 파일 관리를 위해서 TinyMCE의 `images_upload_url` 콜백을 이용하여 글 작성 중 업로드된 이미지를 Django 모델로 관리하게끔 했습니다.

```python
# https://github.com/jazzband/django-tinymce/issues/356#issuecomment-2423819791
@staff_member_required
def tinymce_upload(request: HttpRequest) -> JsonResponse:
   """TinyMCE editor file uploads handler.
   This view is restricted to staff members, as this project uses TinyMCE internally
   for writing blog posts.
   """
   if request.method != "POST" or not request.FILES.get("file"):
       return JsonResponse({"error": "Invalid request"}, status=400)
   uuid = request.POST.get("uuid")
   logger.debug("Uploading file for association UUID: %s", uuid)
   file = request.FILES["file"]
   file_instance = File.objects.create(file=file, association_uuid=uuid)  # ty: ignore[unresolved-attribute]
   return JsonResponse({"location": file_instance.file.url})
```

### 🌐 Django SSR 및 UI 구현

그리고 웹 페이지들은 Django View와 HTML 템플릿으로 구현했습니다. 분리된 FE/BE 개발 환경에서는 API를 정의, 구현 그리고 다시 통합하는 과정이 꽤 수고로웠는데 SSR에서는 그러한 소요가 많이 줄어들어 굉장히 편했습니다. 

Django SSR만을 이용하여 웹 프로젝트를 진행한 것은 처음이었습니다. 하지만 직관적이고 명료한 문법, 다양한 템플릿 태그 및 필터 지원 등과 유용한 디버깅 도구([django-debug-toolbar](https://github.com/django-commons/django-debug-toolbar))의 도움으로 구현 및 테스트 작성이 편리해 많은 도움이 되었습니다.

일단 대부분의 기능은 구현했지만, 당장 필요하지 않은 기능은 잠시 제쳐두었습니다. 댓글이나 사이트 테마 같은 것들인데, 추후에 새로 만들 생각입니다. 이 외에도 HTMX처럼 기본적인 구성은 해 두었지만 아직 쓰지 않은 라이브러리도 많습니다.

## 🛤️ Railway에 Django 애플리케이션 배포하기

애플리케이션 및 데이터베이스는 Railway에 배포했습니다. Railway는 사용성 좋은 웹 기반 UI를 제공합니다. 쉽게 서비스를 배포하고 서로 연계할 수 있습니다. 흥미로운 점은 청구되는 비용은 CPU, 메모리, 네트워크 이그레스, 볼륨의 **실제** 사용량에 기반한다는 것입니다.

![Railway 대시보드](./assets/railway-dashboard.png)

처음 AWS EC2를 이용할 때 사용량 기반 과금이라는 말에 CPU / 메모리 실제 사용량 기반으로 오해했던 일이 있었는데, 흥미롭게도 Railway의 과금은 실제 사용량에 기반합니다. 또한 서버리스 실행 옵션도 있어 자주 사용하지 않는 (예: 개발 환경) 서비스는 요금을 최소화할 수도 있습니다.

![서버리스 절전 모드](./assets/railway-serverless-sleep.png)

### ⚡ 서버리스 및 비용 구조

서버리스 구성에는 별도로 애플리케이션에서 해 주어야 할 일이 없습니다. Railway에서 알아서 처리해줍니다. 해야 할 일은 **Enable Serverless** 설정을 건드는 것 뿐입니다.

![서버리스 활성화 설정](./assets/railway-enable-serverless.png)

`Infra-*` 서비스는 Pulumi IaC를 통해 관리하는 일부 설정값(S3 버킷 이름, IAM 인증 정보 등)을 전달하기 위한 빈 중간 서비스로, [Railway 변수 참조 기능](https://docs.railway.com/reference/variables#reference-variables)으로 설정값을 참조하여 이용합니다. Pulumi를 통해 관리되는 인프라 리소스임을 명확히하고 애플리케이션에서 분리함으로써 서로 영향 범위를 최소화하기 위해 위함입니다.

실제 서비스 재작성 중 발생한 비용은 0.5 USD에 불과했고, Celery를 추가로 구성한 지금은 월 4~5 USD정도 크레딧(Hobby 플랜에는 매달 $5의 크레딧 포함)을 사용하고 있습니다. 거기에 사용량 제한을 걸 수도 있어서 과도한 비용 발생을 막을 수 있습니다.

![Railway 사용 비용](./assets/railway-cost.png)

### ⚠️ Railway의 단점

Railway의 사소한 단점들은 다음과 같습니다.

- 공식 IaC Provider 부재

  Terraform 및 Pulumi Provider가 없기에 [railway-community-provider](https://registry.terraform.io/providers/terraform-community-providers/railway/latest/docs/resources/service)를 이용해야 합니다. Pulumi는 지원하지 않기 때문에 Pulumi에서 이용하려면 [Terraform Providers](https://www.pulumi.com/docs/iac/get-started/terraform/terraform-providers/) 브릿지를 이용해야 합니다.

- 무료 사용자 플랜이 없음

  30일의 체험 기간 동안 $5의 크레딧을 제공하며 이는 테스트에 충분한 양이지만 이후에는 최소 $5/월(Hobby Plan) 비용을 지불해야 합니다. 굉장히 작은 프로젝트를 무료로 배포하고자 한다면 다른 호스팅 서비스를 고려하는 편이 좋습니다.

- 빌드 및 배포 전/후 제한적 커스텀

  제 간단한 블로그 서비스를 배포하는 데에는 큰 문제는 없었지만, 복잡한 배포 라이프사이클을 요구하는 경우 설정에 좀 더 공을 들이거나 빌드 및 배포를 직접 구현해야 할 수도 있습니다.

## 💭 마치며

사이트를 재작성하는 데에는 1달 정도 걸렸습니다. 생각해보면 Django SSR만으로 웹 사이트를 구현한 적이 없었습니다. 학부생 시절에는 SPA 열풍이 불고 있었고, 저 또한 그 흐름에 휩쓸려 Django REST Framework와 Vue.js 2로 처음 웹 개발을 시작했던 기억이 납니다. 그 이후로 SSR을 쓸 일이 거의 없었습니다. SPA가 표준 웹 개발 방식처럼 여겨졌고, SSR은 구식이라는 인식이 강했기 때문입니다.

또한 Django는 충분히 좋은 프레임워크라는 사실을 재차 확인하게 되었습니다. SSR은 직관적이고 단순했고 REST API의 정의 및 연동이 필요하지 않아 작업량이 크게 줄었습니다. 문제 해결을 위해 찾아볼 수 있는 참고 자료도 굉장히 많아 큰 도움이 되었습니다. 어드민을 통해 필요한 관리 기능을 쉽고 빠르게 구현할 수 있었고, Unfold를 통해 어드민의 아쉬운 부분들을 보완할 수 있었습니다.

앞으로는 블로그 뿐만 아니라 개인적으로 이용하기 위한 여러 기능들을 구현하여 이용하려고 합니다.
