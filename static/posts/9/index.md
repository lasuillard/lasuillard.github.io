---
title: Google Apps Script로 작업 자동화하기
publicationDate: 2026-05-18
preview: ./preview.png
summary: >
  Google Apps Script로 귀찮은 반복 작업 자동화하기
tags:
  - GitHub Actions
  - Google Apps Script
  - Google Cloud
  - TypeScript
---

반복되는 귀찮은 일에 지쳤던 적 있으신가요? 캘린더에서 지원되지 않는 음력 생일을 등록하느라 귀찮았던 일, 다시는 보지 않을 오래된 캘린더 일정을 삭제하는 일, 매일같이 어떤 웹 사이트에 로그인해서 알림을 확인하는 일...

누구나 매일, 매주, 매달 혹은 매년 반복하는 작업이 있을 겁니다. 필요하지만 간단한 작업일수록 귀찮은 법이죠. 저도 오랫동안 시달리던 귀찮은 작업들이 있었고, 벼르고 벼르다 이 귀찮은 일들을 자동화하고자 결심했습니다.

## 🤖 왜 Google Apps Script(GAS)인가?

[Google Apps Script](https://developers.google.com/apps-script)(이하 GAS)는 Google Drive에 의해 제공되는 클라우드 기반 자바스크립트 플랫폼입니다. Gmail, Google Calendar, Google Sheets 등 Google Workspace 제품군 전반에 걸쳐 손쉽게 연동되고 다양한 자동화 작업을 수행할 수 있습니다.

### 👍 장점
  - 개인 용도로 차고 넘치는 [무료 할당량](https://developers.google.com/apps-script/guides/services/quotas?hl=ko)
  - [V8 런타임](https://v8.dev/) 지원을 통한 최신 JavaScript(ES6+) 개발 환경
  - [clasp](https://github.com/google/clasp) CLI를 통한 개발 및 배포 자동화
### 👎 단점
  - JavaScript 외 다른 언어를 직접 지원하지 않음
  - 일부 제품(Google Photos, Keep 등)은 비공식 서드파티 라이브러리([GPhotoApp](https://github.com/tanaikech/GPhotoApp) 등)를 써야 함
  - 스크립트 외부 호출 등 일부 고급 기능을 사용하려면 사용자의 Google Cloud 프로젝트를 직접 연결해야 함

저는 이메일(Gmail)부터 일정 관리(Google Calendar / Tasks), 문서 작업(Google Sheets / Docs), 파일 관리(Google Drive) 등 다양한 Google Workspace 제품을 이용하고 있으며, 대부분의 반복 작업도 이 환경 위에서 이루어지기 때문에 작업 자동화에는 Google Apps Script 만한 게 없었습니다.

## ☄️ 개발 환경 구성하기

여러 작은 프로젝트에 적당한 크기의 기능을 구현하고 관리하기 위해 [PNPM](https://pnpm.io/)을 패키지 매니저로 선택했습니다. PNPM 워크스페이스는 빠르게 사용할 수 있는 모노레포 도구로서 안성맞춤입니다.

글을 쓰는 지금, 프로젝트 디렉토리 구조는 다음과 같이 되어 있습니다.

```bash
$ tree -a --gitignore -I .git --sort name --dirsfirst
.
├── .devcontainer.example
│   └── ...
├── .github
│   └── workflows
│       ├── ci.yaml
│       └── deploy.yaml
├── .vscode.example
│   └── ...
├── packages
│   ├── config
│   │   ├── src/
│   │   ├── test/
│   │   ├── README.md
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── tsup.config.ts
│   │   └── vitest.config.ts
│   ├── esbuild-plugins
│   │   └── ...
│   ├── gas-mock
│   │   └── ...
│   ├── ssdb
│   │   └── ...
│   └── util
│       └── ...
├── projects
│   └── ...
├── .editorconfig
├── .env.example
├── .gitattributes
├── .gitignore
├── .node-version
├── .pre-commit-config.yaml
├── .prettierignore
├── .prettierrc
├── AGENTS.md
├── Makefile
├── README.md
├── docker-compose.yaml
├── eslint.config.mjs
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── renovate.json
├── tsconfig.base.json
└── tsconfig.json
```

- `.devcontainer.example`, `.vscode.example`, `.env.example`, `docker-compose.yaml`

  개발 컨테이너를 비롯한 개발 환경 관련 구성 파일들입니다.

- `packages/`

  프로젝트에서 공통적으로 사용하는 라이브러리들입니다.
  - `config`: GAS 속성 서비스 기반의 설정 관리 방식을 통일하기 위한 도구
  - `gas-mock`: 단위 테스트(Vitest) 환경에서 `ScriptApp`, `PropertiesService` 등 GAS 전역 객체를 모킹하기 위한 헬퍼
  - `ssdb`: 스프레드시트를 간단한 데이터베이스처럼 다루기 위한 추상화 도구
  - `util`: 공통 유틸리티

- `projects/`

  GAS 스크립트 프로젝트들입니다.

- `pnpm-lock.yaml`, `pnpm-workspace.yaml`

PNPM 연관 파일로 모노레포 패키지와 프로젝트 전역 의존 패키지 카탈로그를 관리합니다.

개발에 TypeScript를 사용하고, 변경 사항은 굉장히 사소한 것을 제외하고 모두 PR을 거칩니다. GitHub Actions 파이프라인을 거쳐 Prettier, ESLint로 코드 품질을 검사하고 Vitest로 자동화 테스트를 실행합니다.

GAS 환경은 Node.js나 브라우저와 달리 자체 모듈 시스템(`import`/`export`)을 지원하지 않고 모든 파일이 단일 전역 스코프로 병합됩니다. 따라서 PR이 병합되면 [ESBuild](https://esbuild.github.io/)와 [tsup](https://github.com/egoist/tsup)으로 모듈을 단일 스크립트로 번들링 및 빌드한 뒤, clasp CLI로 Apps Script에 배포됩니다.

## ⚙️ 설정 관리

프로젝트 설정은 속성 서비스 ([Properties Service](https://developers.google.com/apps-script/guides/properties))를 이용합니다. 내부용 / 개인용 스크립트 프로젝트에서 쉽고 빠르게 사용할 수 있어 좋은 선택입니다.

![속성 서비스 설정](./assets/properties-service.png)

하지만 매번 스크립트 설정에 가서 설정을 바꾸는 것은 귀찮기에, 애드온으로 관리하기로 했습니다. 설정을 저장하기 전에 검증할 수도 있고, 작업 수동 실행 등 여러 편의 기능을 구현해서 쓸 수 있습니다.

> ⚠️ 개인용 / 내부용 프로젝트가 아닌 대중에 공개될 프로젝트라면 스크립트 속성(`ScriptProperties`)을 사용하는 것은 부적합합니다. 모든 사용자가 동일한 설정을 공유하고 수정할 수 있어 API 키나 개인정보가 노출될 위험이 있기 때문입니다. 이 경우에는 사용자별로 격리되는 `UserProperties`가 권장됩니다.

![애드온 UI](./assets/addon-ui.png)

그리고 모든 Google Workspace 제품이 애드온 UI (`CardService`)를 지원하는 것은 아니므로 주의해야 합니다. 대표적인 제품은 Contacts (People)인데, 저는 대신 Google Calendar에 애드온을 만들어 관리하기로 했습니다.

## 🚀 변경된 프로젝트만 배포하기

초기 배포 구성은 `pnpm run --recursive`로 모든 프로젝트를 변경 사항이 없어도 배포하고 있었습니다. 하지만 사소한 변경 사항, 심지어는 전혀 관련이 없는 변경 사항에도 모든 프로젝트를 배포하는 것은 낭비였고 변경된 프로젝트만 배포하길 원했습니다.

PNPM의 필터(`--filter`) 기능을 활용해 GitHub Actions 매트릭스로 변경된 프로젝트만 배포 작업을 동적으로 생성하기로 했습니다.

### 📦 동적 배포 매트릭스 구성

```yaml
name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

# ...

jobs:
  prepare:
    name: Prepare deployment matrix
    # ...
    outputs:
      matrix: ${{ steps.build_matrix.outputs.matrix }}
    steps:
      # ...
      - name: Build deployment matrix
        id: build_matrix
        run: |
          if [ "${{ github.event_name }}" = "workflow_dispatch" ]; then
            # Manual dispatch: deploy all projects unconditionally
            packages=$(pnpm list --filter "./projects/**" --json --depth -1)
          else
            # Push to main: compare against the previous commit
            packages=$(pnpm list --filter "...[HEAD^1]" --json --depth -1)
          fi
          echo "$packages"
          # Filter to only packages under projects/ and strip the absolute workspace prefix from paths
          matrix=$(echo "$packages" | jq -c --arg ws "${{ github.workspace }}/" '[.[] | select(.path | contains("/projects/")) | {name: .name, path: (.path | ltrimstr($ws))}]')
          echo "matrix=$matrix"
          echo "matrix=$matrix" >> "$GITHUB_OUTPUT"
```

- `pnpm list --filter "...[HEAD^1]" --json --depth -1`

  직전 커밋과 비교하여 변경된 패키지 목록을 반환합니다.

  ```json
  [
    ...
  {
    "name": "@packages/config",
    "path": "/home/dev/Projects/google-apps-script/packages/config",
    "private": false
  },
  {
    "name": "cleanup-old-calendar-events",
    "path": "/home/dev/Projects/google-apps-script/projects/cleanup-old-calendar-events",
    "private": true
  },
  ...
  ]
  ```

- `jq -c --arg ws "${{ github.workspace }}/" '[.[] | select(.path | contains("/projects/")) | {name: .name, path: (.path | ltrimstr($ws))}]'`

  앞서 실행한 명령어는 모든 변경된 패키지 목록을 출력하므로 `jq`를 사용해서 변경된 패키지 중 `projects` 디렉토리에 있는 패키지만 필터링합니다.

이후 배포 매트릭스는 각 프로젝트를 빌드하여 배포하게 됩니다.

```yaml
# ...
jobs:
  deploy:
    name: Deploy (${{ matrix.name }})
    needs: prepare
    if: needs.prepare.outputs.matrix != '[]'
    strategy:
      fail-fast: false
      matrix:
        include: ${{ fromJson(needs.prepare.outputs.matrix) }}
    environment:
      name: 'projects/${{ matrix.name }}'
      url: https://script.google.com/home/projects/${{ steps.read_clasp.outputs.script_id }}/edit
    # ...
    steps:
      # ...
      - name: Read script ID from .clasp.json
        id: read_clasp
        run: |
          script_id=$(jq -r '.scriptId' '${{ matrix.path }}/.clasp.json')
          echo "script_id=$script_id" >> "$GITHUB_OUTPUT"

      - name: Authenticate with clasp
        run: |
          echo '${{ secrets.CLASPRC_JSON }}' > ~/.clasprc.json
          chmod 600 ~/.clasprc.json

      - name: Deploy to Google Apps Script
        run: pnpm --filter '${{ matrix.name }}' run deploy
```

간간이 스크립트를 웹 에디터에서 볼 필요가 있기 때문에 배포 URL을 설정해주었습니다.

## 🪝 배포 후 초기화 자동 실행하기

`clasp run-function` 도구를 이용하여 배포 후 초기화(주로 트리거)를 자동 실행하고자 했으나, 새 스크립트 프로젝트는 기본적으로 `scripts.run` API를 사용할 수 없다는 문제가 있었습니다.

`scripts.run` API를 사용하고자 할 경우, 사용자는 본인의 Google Cloud 프로젝트를 연결하고 여러 설정을 끝마쳐야 합니다.

1.  Google Cloud 프로젝트를 만들고 Apps Script API를 사용 설정합니다.

    ![Google Cloud 프로젝트](./assets/google-cloud-project.png)

    스크립트 프로젝트가 사용하는 서비스에 해당하는 API(People, Calendar, Sheets, Gmail API 등) 또한 사용 설정해야 합니다.

2.  Apps Script API의 **관리** 버튼을 누르고 **OAuth 동의 화면** 구성을 끝마칩니다. 데스크톱 앱 유형의 클라이언트를 생성하고 클라이언트 비밀 정보를 JSON 파일로 다운로드하여 보관(e.g. `creds.json`)해둡니다.

    ![OAuth 클라이언트 생성](./assets/clasp-oauth-client.png)

3.  다운로드한 JSON 파일을 이용하여 clasp 로그인을 다시 진행합니다. 이미 로그인 한 적이 있다면 먼저 `clasp logout`으로 로그아웃한 뒤 진행합니다.

    ```bash
    $ clasp login \
      --creds ./creds.json \
      --extra-scopes https://www.googleapis.com/auth/script.scriptapp
    ```

4.  Apps Script 설정에서 **Google Apps Script API**를 사용 설정합니다.

    ![Apps Script API 사용 설정](./assets/apps-script-api.png)

5.  GAS 프로젝트를 API 실행 파일로 배포해야 합니다. Apps Script 웹 UI에서 새 배포를 만들어도 되고, `appsscript.json` 매니페스트에 다음 내용을 추가한 뒤 배포해도 됩니다.

    ```json
    {
    	// ...
    	"executionApi": {
    		"access": "MYSELF"
    	}
    }
    ```

이후 프로젝트를 다시 배포한 뒤, `clasp run-function <초기화 함수 이름>`으로 배포 후 초기화 작업을 실행합니다. 저는 `initialize()` 함수를 정의해서 배포 후 자동 실행되게끔 했습니다.

추가로, 게시 상태가 **테스트 중**인 앱의 OAuth2.0 인증 정보는 7일마다 만료([참고 문서](https://developers.google.com/identity/protocols/oauth2?hl=ko))되어 도중에 `invalid_grant` 오류를 맞닥뜨릴 수 있습니다. 이 경우 게시 상태를 **프로덕션 단계**로 변경해야 만료되는 것을 막을 수 있습니다.

## 🐞 문제 해결

### 🚫 `clasp login` 후 `run-function`을 사용할 수 없음

도중에 크게 헤맨 것은 **데이터 액세스** 페이지에서 추가한 스코프가 `clasp login`에 사용되지 않는다는 것이었습니다. `run-function`을 사용해서 배포 후 초기화 작업을 자동화하기 위해 `https://www.googleapis.com/auth/script.scriptapp` 스코프가 필요했지만 데이터 액세스를 통해 요청할 수 없었고, `clasp login`의 `--extra-scopes` 매개변수를 통해 명시적으로 요청하여 해결할 수 있었습니다.

[Google Workspace 문서](https://developers.google.com/workspace/marketplace/configure-oauth-consent-screen)에 따르면 데이터 액세스 페이지에 정의된 스코프는 퍼블릭으로 공개된 프로젝트에 대해서만 활용되는 것으로 보입니다.

![OAuth 동의 화면 스코프](./assets/oauth-consent-scopes.png)

단일 프로젝트 구성이라면 `--use-project-scopes`와 `--include-clasp-scopes`를 사용해서 `appsscript.json`의 `oauthScopes`를 포함하도록 할 수 있지만 제 경우는 여러 프로젝트가 포함된 모노레포 구성이라 바로 사용할 수는 없었습니다.

### 🛂 스크립트 권한 누락

애드온을 통해 작업을 수동 실행할 때 실패하는 문제가 있었습니다. 디버깅 결과 필요한 권한이 누락되었기 때문이었습니다. 원인을 추적해보니 다음과 같았습니다.

1.  애드온을 처음 사용할 때 다음과 같은 권한 요청 화면이 각 제품(Google Calendar, Gmail)마다 한 번씩 표시됩니다.

    ![권한 요청](./assets/permission-request.png)

2.  계속 진행하여 권한을 부여할 수 있는데,

    ![권한 부여](./assets/permission-grant.png)

    문제는 처음 권한을 부여받은 프로젝트가 요구한 권한만 반영되기 때문에, 다른 프로젝트에서 필요한 권한을 포함하지 못한다는 점이었습니다. 권한을 한 번 부여하고 나면 위의 요청 화면은 다른 애드온에서는 다시 나타나지 않습니다.

3.  [`ScriptApp.getAuthorizationInfo`](https://developers.google.com/apps-script/reference/script/script-app?hl=ko#getauthorizationinfoauthmode,-oauthscopes) 함수를 이용해서 명시적으로 필요한 권한이 있는지, 없다면 요청하게끔 애드온 UI를 개선해주면 필요한 권한이 누락되었을 경우 요청 페이지를 통해 권한을 부여하도록 요청할 수 있습니다.

    ![권한 요청](./assets/authorize.png)

    다른 애드온이 필요한 모든 권한을 미리 요청할 수도 있겠지만, 각 스크립트 프로젝트가 독립된 경계를 유지하도록 남겨두면 언젠가 필요할 때 쉽게 프로젝트를 분리할 수도 있습니다. 디버깅 또한 용이할 것이라 생각되어 지금의 구현을 유지하기로 했습니다.

## 🖼️ 만들어 본 것들

여러 간단한 GAS 프로젝트를 만들어보았습니다. 각 GAS 스크립트 개발에는 GitHub Copilot을 적극적으로 활용하며 AI 활용 감각을 잡아가고자 했습니다. GitHub 웹 UI에서 이슈 할당과 PR 코멘트로 에이전트에게 작업을 맡기고 PR 리뷰로 피드백 루프를 거치며 기능을 개선해나갔습니다. GitHub의 에이전트 협업 흐름은 꽤 부드럽고 자연스러워서 마치 정말 동료 개발자와 원격으로 소통하며 작업한다는 느낌이 들었습니다. 어느 정도 아귀가 맞으면 마지막으로 코드를 직접 다듬으며 각 프로젝트를 마무리했습니다.

- **cleanup-old-calendar-events**

  오래된 Google Calendar 이벤트를 자동으로 삭제해줍니다.

- **lunar-birthday**

  Google Calendar에서 지원되지 않는 음력 생일을 관리하기 위해 만들었습니다. 음력 생일을 양력으로 변환하여 캘린더에서 쉽게 확인할 수 있게 합니다.

  가령 음력 1970년 8월 1일 출생자의 2026년 생일은 6월 19일입니다. 스크립트가 실행되면 Google Calendar에서 해당 연락처의 2026년 생일 일정을 6월 19일로 등록/갱신하여 캘린더에서 그해의 생일을 쉽게 확인할 수 있게 합니다. 과거 생일 이력은 남지 않지만 아직까지 필요한 적이 없었고, 필요하다면 생년월일을 고치는 대신 새로운 일정을 생성하도록 확장할 수도 있습니다.

- **naver-notifications**

  네이버 알림을 매번 들어가서 보기 너무 귀찮아서 만들었습니다. 네이버 알림을 스크래핑해서 매일 특정 시간에 Gmail로 요약을 보내줍니다.

  현재는 브라우저에서 추출한 세션 쿠키를 속성 서비스(`PropertiesService`)로 주입해 사용하고 있습니다. GAS 환경에서는 브라우저 렌더링 기반 스크래핑이나 로그인 자동화가 어렵기 때문에, 추후에는 Google Cloud Run 기반의 전용 크롤러 애플리케이션으로 분리하여 이 한계를 해결할 계획입니다.

  ![네이버 알림 요약](./assets/naver-notification.png)

- **theclimb-routesetting-schedule**

  취미로 클라이밍을 하러 가기 전에 루트 세팅 일정을 확인하곤 하는데, SNS(인스타그램)나 네이버 블로그 등에 아래와 같은 루트 세팅 스케줄 이미지를 공지하곤 합니다.

  ![루트 세팅 일정 예시](./assets/climbing-schedule.png)

  하지만 매번 여러 지점의 스케줄을 확인하는 게 번거로웠고 Google Calendar에서 한 눈에 여러 지점의 루트 세팅 일정을 확인하고 싶었습니다. 그래서 루트 세팅 스케줄 이미지를 스크래핑하고 Google AI Studio API로 이미지 이해가 가능한 Gemini 모델(gemini-3-flash-preview)을 호출하여 이미지에서 스케줄 목록을 추출한 뒤 Google Calendar 이벤트로 저장하는 프로젝트를 만들었습니다.

  이 과정에서 GAS의 6분 실행 시간 제한과 작업 실패 상황을 고려하여 앞서 소개한 `ssdb` 패키지를 작업 큐(Queue) 겸 상태 저장소로 활용했습니다. 작업 도중 타임아웃이 발생하더라도 작업을 스프레드시트에 기록해두고 다음 실행 시점에 재시도(Retry)할 수 있도록 설계했습니다.

  ![Google Calendar 이벤트](./assets/google-calendar.png)

## 💭 마치며

PNPM을 단순 패키지 매니저로 활용한 적은 있지만 모노레포를 관리하기 위해 활용한 건 이번이 처음입니다. 의존성 변경을 감지하는 기본 기능이 훌륭해서 많은 툴링 없이 원하는 자동화 구성을 만들기 편리했습니다.

앞으로도 필요한 여러 자동화를 추가해나가며 계속 구성을 개선해나갈 생각입니다.
