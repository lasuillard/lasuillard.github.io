---
title: Chrome 확장 프로그램 개발하기
publicationDate: 2026-09-17
preview: ./preview.png
summary: >
  Raindrop 북마크를 동기화하는 Chrome 확장 프로그램 개발하기
tags:
  - Chrome Extension
  - Raindrop
  - TypeScript
  - Web Development
series: Raindrop Sync for Chrome
---

이전 글에서는 Raindrop Sync for Chrome (RSFC) 브라우저 확장 프로그램을 위한 [raindrop-client](https://www.npmjs.com/package/@lasuillard/raindrop-client) 라이브러리 개발 및 테스트에 대해 다루었습니다. 개발을 위한 준비의 준비가 완료되었으니, 이제 실제 Chrome 확장 프로그램 개발에 착수할 수 있게 되었습니다.

RSFC를 개발하게 된 배경에 대해서는 이전에도 다루었지만, Raindrop 북마크를 브라우저에 동기화하여 브라우저나 Raycast와 같은 퀵 런처 프로그램에서 쉽고 빠르게 접근하기 위함이었습니다. 퀵 런처의 Raindrop 플러그인이나 확장 프로그램을 사용할 수도 있겠지만, 브라우저 북마크는 많은 퀵 런처에서 자체 또는 플러그인/확장 프로그램을 통해 지원되는 공통적인 기능이기 때문에 북마크를 브라우저에 동기화하는 것이 더 범용적이고 효율적입니다.

이번 글에서는 실제로 Chrome 확장 프로그램을 개발하고 배포한 과정에 대해 이야기하고자 합니다.

## ✨ RSFC 미리보기

> 💡 RSFC는 Chrome Web Store([링크](https://chromewebstore.google.com/detail/raindrop-sync-for-chrome/iacjnnndmkebkjdcdedfbmccofnmaojf))에 게시되어 있으며, 누구나 설치하여 사용할 수 있습니다.

언제, 어떻게 동기화가 이루어지는지 설정할 수 있습니다.

![동기화 설정](./assets/sync-settings.png)

현재 Chrome 및 Raindrop 북마크 상태를 불러와 비교할 수 있습니다.

![북마크 상태 비교](./assets/sync-diff.png)

동기화 계획을 수립하고 실행할 수 있습니다. 어떤 북마크가 추가되거나 삭제될지 미리 확인할 수 있습니다.

![동기화 계획](./assets/sync-plan.png)

동기화 후 브라우저 북마크가 정상적으로 생성됩니다. 아래는 Raycast Browser Bookmark 플러그인을 통해 본 모습입니다.

![Raycast에서의 접근 예시](./assets/raycast-example.png)

## 🏗️ 애플리케이션 설계

동기화 과정은 Chrome, Raindrop 서버 간에 이루어지는 비교적 단순한 과정입니다.

```mermaid
sequenceDiagram
  participant U as User
  participant C as Chrome
  participant R as Raindrop

  U->>C: Initiate sync
  C->>R: Fetch Raindrop bookmarks
  R-->>C: Return bookmarks
  C->>C: Compare with current state
  C->>C: Generate sync plan
  C->>C: Optimize sync plan
  C->>C: Execute sync plan
  C-->>U: Sync complete
```

동기화 이벤트는 간단한 옵저버 패턴을 적용하여 관리합니다. `SyncService`는 동기화 상태 변경을 구독자에게 통지하며, 이를 통해 UI 업데이트나 로그 기록 등의 작업을 수행할 수 있습니다.

### 🧰 테크 스택

| 항목           | 설명                                            |
| -------------- | ----------------------------------------------- |
| 프론트엔드     | [Svelte](https://svelte.dev/) + TypeScript      |
| UI             | [Flowbite Svelte](https://flowbite-svelte.com/) |
| 빌드 및 패키징 | Vite + CRXJS[^1]                                |
| 상태 관리      | Chrome Storage API (`storage.sync`)             |
| 배포           | GitHub Actions                                  |
| 호스팅         | Chrome Web Store                                |

Svelte를 선택하게 된 데에는 뾰족한 이유가 있는 것은 아닙니다. 대개 늘 그렇듯, 익숙한 도구나 배우고 싶은 도구를 사용하기 마련이니까요. 하지만 우연찮게도 Svelte는 지금의 프로젝트에 최적의 선택이었습니다. Svelte의 직관적인 문법, Vite의 빠른 빌드 속도, CRXJS가 제공하는 HMR(Hot Module Replacement) 기능은 개발 과정에서 빠른 피드백을 제공하여 생산성을 크게 향상시킬 수 있었습니다.

[^1]: [CRXJS](https://crxjs.dev/)는 Vite 기반 Chrome 확장 프로그램 개발 도구입니다.

### 🔄 동기화 전략

Chrome 북마크와 Raindrop 북마크 데이터의 차이로 인해 동기화 구현에 신중하게 접근해야 했습니다. Chrome 북마크는 단순한 구조를 가지고 있으며, 제목, URL, 폴더 구조 정도만 존재합니다. 반면 Raindrop 북마크는 메타데이터와 태그 등 추가 정보를 포함하고 있어 양방향 동기화 구현 시 충돌 관리가 복잡해질 수 있으며, 데이터 손실로 이어질 가능성이 있습니다.

따라서 RSFC는 Raindrop을 단일 진실 공급원(Source of Truth)으로 설정하고, Chrome 브라우저 북마크는 읽기 전용 뷰(Read-only Projection)로 취급합니다. Raindrop에서 Chrome으로의 단방향 동기화만을 지원하며, 데이터 손실 및 충돌 가능성을 배제했습니다. Chrome에서 북마크를 직접 수정하더라도 다음 동기화 시 Raindrop의 상태로 덮어쓰게 됩니다.

동기화는 크게 두 가지 방법으로 시작할 수 있습니다. 사용자가 수동으로 실행하거나, 브라우저 Alarms API를 사용하여 주기적으로(Polling) 자동 실행하는 방식입니다. Raindrop User API는 최종 수정 시각 정보를 제공하므로, 이를 브라우저 상태(`storage.sync`)에 저장된 최종 동기화 시각과 비교하여 변경 사항이 있는 경우에만 동기화 작업을 수행하도록 최적화할 수 있습니다.

## 🛠️ 개발 과정

### 🌳 초기 구현: 트리 기반 동기화

극초기 구현은 Chrome 북마크와 Raindrop 북마크를 트리 구조로 표현하고, 전체 동기화를 수행하는 방식이었습니다.

1. Chrome 및 Raindrop 북마크 트리를 만듭니다.
1. Chrome 동기화 대상 폴더를 삭제합니다.
1. Raindrop 북마크 트리를 기반으로 Chrome 북마크를 모두 재생성합니다.

이 방식은 직관적이고 구현도 비교적 간단하지만, Chrome 북마크가 많아질수록 성능 문제가 발생할 수 있었습니다. 당장 약 ~1,000개의 북마크를 동기화하는 데에는 성능상 큰 무리가 없었지만, 매번 모든 북마크를 재생성하는 것은 단순히 생각해도 비효율적이었습니다. 게다가 추후 계획하고 있던 부분 동기화나 최적화 등을 감안하면 세밀한 동기화 조정이 필요했습니다. 이후 점진적 동기화(Incremental Sync) 구현을 위해 Desired State Model을 도입함으로써, 변경 사항만을 반영하는 효율적인 동기화가 가능해졌습니다.

### ⚡ 점진적 동기화: Desired State Model

점진적 동기화는 전체 동기화를 수행하는 대신, 변경 사항만을 반영하는 방식입니다. Terraform이나 Kubernetes와 같은 IaC, Infrastructure as Code 도구들에서 영감을 받아 Desired State Model을 도입해 현재 상태(Current State)와 목표 상태(Desired State)를 비교하고 필요한 변경만 적용하도록 구현했습니다.

Desired State Model의 도입을 통해, 다음과 같은 이점을 누릴 수 있었습니다.

- **선언적 동기화(Declarative Sync)**: Desired State Model을 통해 목표 상태를 선언적으로 정의하고, 현재 상태와 비교하여 필요한 변경만 적용함으로써 동기화 과정을 명확하고 예측 가능하게 만들 수 있으며, 목표 상태를 변경하는 것으로 세부 동기화 정책을 조정할 수 있습니다.
- **충돌 관리 용이**: 단일 진실 소스를 기반으로 동기화를 수행하므로 충돌 발생 가능성이 낮고 관리가 용이합니다.
- **자가 치유(Self-Healing)**: 충돌, 오류 및 예외 상황에 대응하여 동기화 상태를 멱등성(Idempotency)을 기반으로 자동으로 복구할 수 있습니다. 오류로 인해 동기화가 중단되더라도, 다음 동기화 시 원하는 상태로 나아갈 수 있습니다.

## 🐞 트러블슈팅

### 🪪 노드의 고유성(Identity)

초기에는 Raindrop과 Chrome 북마크 간의 ID 매핑 정보를 IndexedDB나 로컬 스토리지를 이용하여 저장하고 활용하는 방안도 검토했었습니다. 하지만 복잡한 데이터를 관리하기 위한 부담이 크고, 동기화 로직이 더욱 복잡해질 수 있었습니다. 무엇보다 가장 분명한 한계는 크롬의 기기 간 동기화 기능이었습니다. 북마크는 기기 간에 자동으로 동기화되므로, 로컬(IndexedDB나 로컬 스토리지)에서 관리하는 ID 매핑 정보는 다른 기기와 일관성을 유지하기 어렵습니다. 이를 해결하려면 [Chrome Storage API (Sync)](https://developer.chrome.com/docs/extensions/reference/api/storage#property-sync)를 사용해야 하는데, 이 API들은 저장 용량과 속도 측면에서 제약(100KB, 120쓰기/분)이 있어 적합하지 않다고 판단했습니다.

이러한 제약을 고려하여 무상태성(Stateless) 방식을 채택했습니다. Raindrop ID에 대한 Chrome 북마크 매핑을 유지하지 않기 때문에 두 트리의 ID를 비교하는 것은 의미가 없습니다. ID 기반 비교는 신뢰할 수 없으며, 대신 노드의 위치(Path)와 내용(URL)을 기반으로 동등성을 평가합니다. 하지만 북마크는 동일한 위치에 동일한 URL을 가진 항목이 존재할 수 있습니다. Path와 URL의 조합으로 고유성을 보장할 수는 없었기에 중복을 허용하지 않도록 구현하여 동일한 위치에 동일한 URL을 가진 북마크가 존재할 경우, 후속 항목은 무시되도록 처리했습니다.

### 🟰 노드 간 동등성(Equality) 비교

앞서 짧게 언급했듯, Chrome 북마크와 Raindrop 북마크 노드는 서로 다른 데이터 구조를 가지고 있어 동등성 비교 시 주의를 기울일 필요가 있었습니다. 개발 중 같은 북마크가 반복적으로 재생성되는 문제를 경험하기도 했는데, 같은 URL도 사소한 차이(예: 쿼리 파라미터 순서, 후행 슬래시 등)로 인해 다른 것으로 판단될 수 있기 때문이었습니다. 사소한 차이를 무시하고 동등성을 평가하기 위해 URL 정규화 과정을 거치도록 구현했습니다.

## 🚀 배포 파이프라인

배포 과정은 빌드 후 Chrome Web Store (CWS)에 업로드하는 방식으로 진행됩니다. 먼저 소스 코드를 빌드하여 확장 프로그램 패키지를 생성하고, [MobileFirstLLC/cws-publish](https://github.com/MobileFirstLLC/cws-publish)(내부적으로 Chrome Web Store API 사용)를 이용하여 CWS에 제출합니다. 업로드 후 즉시 배포되는 것이 아니라 심사를 거쳐 승인된 후 사용자에게 배포됩니다.

![Chrome Web Store 게시 화면](./assets/chrome-web-store.png)

## ⚠️ 향후 과제

이번에 구현한 RSFC는 기본적인 단방향 동기화 기능만을 제공하며, 여전히 여러 가지 개선 과제가 남아 있습니다.

- **대량 동기화 시나리오 최적화**: 큐, Rate Limiting (Raindrop API)
- **브라우저 지원 추가**: Firefox 등 다른 브라우저에 대한 지원을 고려하고 있습니다. 현재 Chromium 기반으로 개발 및 테스트가 이루어지고 있으며, 다른 브라우저로의 확장도 검토 중입니다.
- **선택적 동기화(Selective Sync)**: Raindrop 쿼리 기반, 단일 동기화 폴더가 아니라 사용자가 지정한 조건에 따라 북마크를 선택적으로 동기화할 수 있는 기능을 제공하고자 합니다.
- **코드베이스 리팩토링**: 더 나은 구조와 유지보수성을 위해 점진적으로 테스트 케이스를 보강하며 기능 구현과 함께 코드를 다듬어 나갈 생각입니다. 현재 구조는 백엔드 Service - Repository 패턴을 사용하고 있는데, 이 프로젝트 특성에 맞지 않고 겉도는 느낌이 있습니다. 브라우저 확장이라는 특수한 실행 환경과 단기적인 생명 주기를 고려한 최적의 설계를 모색하고 있습니다.

## 💭 마치며

사실 RSFC를 Chrome Web Store에 게시한 지도 벌써 몇 달이 지났습니다. 이 글을 이제야 작성하게 된 이유는, 놀랍게도 그저 까먹었기 때문입니다. 하지만 이렇게 늦게라도 기록을 남기게 되어 다행이라고 생각합니다. 다른 사이드 프로젝트를 하다보니 RSFC에 시간을 충분히 투자하지 못하고 있지만, 앞으로도 꾸준히 개선하고 발전시켜 나갈 계획입니다.
