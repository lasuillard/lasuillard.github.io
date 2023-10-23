<script lang="ts">
	import { browser } from '$app/environment';
	import Markdown from '$components/Markdown.svelte';
	import QRCode from '$components/QRCode.svelte';

	const pageURL = browser ? window.location.href.split('#')[0] : null;
</script>

<div class="prose max-w-none px-2 py-6">
	<h1>이유찬</h1>

	{#if pageURL}
		<QRCode text={pageURL} class="flex flex-col justify-self-end" />
	{/if}

	<!-- prettier-ignore -->
	<Markdown>
더 나은 코드를 끝없이 갈망하는 개발자, 이유찬입니다.

주니어 개발자로서 여러 웹 기반 B2C/B2B 서비스 및 솔루션의 백엔드 개발, 배포 및 운영 경험을 쌓아가고 있습니다.

반복되는 작업을 찾아 자동화하는 일, 오래된 코드를 새로운 기술과 방법론으로 리팩토링하는 과정을 즐깁니다.

자동화된 테스트를 통해 서비스의 신뢰성과 안정성을 개선하기 위해 노력을 기울이고 있습니다. 또한 동료와의 협업을 위해 문서화, 가독성 좋은 코드에 대해 항상 고민합니다.
  </Markdown>

	<Markdown>## SKILL</Markdown>

	<!-- prettier-ignore -->
	<Markdown>
## EDUCATION

-   서울과학기술대학교 컴퓨터공학과 졸업 (4.11/4.5)

    2014.02 ~ 2020.02

## CERTIFICATE

-   정보처리기사

    2020.08.28

-   TOEIC (935)

    2018.09.15

-   정보기기운용기능사

    2016.12.05

-   정보처리기능사

    2015.02.05

## EXPERIENCE

### 에이젠글로벌

AI BaaS 서비스를 제공하는 B2B 핀테크 스타트업

우리카드 FDS 고도화 프로젝트 및 ABACUS AutoML 솔루션의 개발 및 유지보수

### 얼리페이

소상공인을 위한 카드매출 선정산 서비스를 제공하는 B2C 핀테크 스타트업

2명의 백엔드 개발자 및 1명의 프론트엔드 개발자와 함께 서비스 개발

## PROJECT

### ABACUS 개발 및 유지보수

-   백엔드 개발자
-   2022.12 ~ 2023.08

1 BE, 1 FE, 2 ML 동료 개발자와 함께 ABACUS AutoML 솔루션의 개발 및 유지보수

-   레거시 애플리케이션 유지보수
-   고객사 (우리FIS) 장애 대응
-   차세대 AutoMLOps 솔루션 ABACUS Enterprise 설계 및 기획 참여

### 우리카드 FDS 고도화

2명의 동료 백엔드 개발자와 함께 우리카드 FDS의 레거시 딥러닝 스코어링 서버 유지보수 및 신규 기능 개발, 성능 개선

-   레거시 우리카드 FDS 시스템의 유지보수 및 신규 기능 개발
    -   일일 약 700만건의 요청을 처리하는 Python Twisted 기반 비동기 TCP 서버 애플리케이션 유지보수
    -   딥러닝 스코어링 요청 처리 다중 프로세스 Python 애플리케이션 유지보수
-   애플리케이션 성능 개선 작업
    -   리소스 사용량 개선을 통한 서버 안정화
    -   Locust를 이용한 부하 테스트
    -   레거시 ClickHouse 데이터베이스 성능 개선

### 얼리페이 서비스 개발 및 출시

-   백엔드 개발자
-   2021.06 ~ 2021.12

2명의 백엔드 개발자 및 1명의 프론트엔드 개발자와 함께 서비스 개발 및 출시

-   Django 기반 선정산 서버 개발
    -   데이터베이스 설계 및 ORM 구현
    -   Django Admin을 이용한 정산 관리자 페이지 개발
    -   SPA FE 웹 애플리케이션과의 통신을 위한 REST API 구현 (DRF)
    -   Celery를 이용하여 정기 일괄 작업 처리
    -   여러 내/외부 서비스와 연동 (크롤러, 펌뱅킹, 카카오 알림톡, Slack, etc.)
-   선정산 데이터 수집을 위한 웹 크롤러 개발
    -   기존 Flask 1 기반 크롤러 구현을 FastAPI로 마이그레이션, 전반적인 구조 및 성능 개선
    -   VAN (Value-Added Network) / 배달 플랫폼 크롤러 구현
-   Etc.
    -   컨테이너 기반 개발 환경 구성 (Docker, Docker Compose, VS Code Devcontainer)
    -   코드 품질 개선을 위한 CQA 도구 도입 (pre-commit, flake8, isort 및 Black / Mypy)
    -   pytest를 이용한 자동화 테스트
    -   GitHub Actions를 이용하여 서비스 배포 자동화 (AWS Beanstalk)
    -   모니터링 구성 및 연동 (CloudWatch, Sentry)

## PERSONAL WORK

-   [lasuillard.github.io](https://github.com/lasuillard/lasuillard.github.io)

    바닥부터 직접 개발한 기술 블로그 정적 웹 사이트

    SvelteKit, GitHub Actions, Tailwind CSS, DaisyUI

-   [kkowa](https://github.com/lasuillard/kkowa)

    중간자 프록시를 이용하여 타사 애플리케이션의 네트워크 데이터를 통해 유용한 정보를 추출, 가공하기 위한 GUI 애플리케이션

    Python, GitHub Actions, PySide6, gRPC, mitmproxy

-   [Libra](https://github.com/lasuillard/Libra)

    PC의 수많은 파일을 탐색 및 라벨링하여 체계적으로 관리하기 위한 GUI 애플리케이션

    Rust, Tauri, TypeScript, Tailwind CSS, GitHub Actions

-   [Raindrop Sync for Chrome](https://github.com/lasuillard/raindrop-sync-chrome)

    Raindrop.io 북마크를 크롬 브라우저 북마크와 동기화하기 위한 크롬 브라우저 확장 프로그램

    Svelte,Tailwind CSS, TypeScript, GitHub Actions
  </Markdown>
</div>

<style lang="postcss">
</style>
