<script lang="ts">
	import { browser } from '$app/environment';
	import Markdown from '$components/content/Markdown.svelte';
	import QRCode from '$components/content/QRCode.svelte';
	import { format } from 'date-fns';

	const pageURL = browser ? window.location.href.split('#')[0] : null;

	// Tag reference counter
	let tagRefs: { [key: string]: number } = {};

	// Bulk-ref tags
	const tags = (...tags: string[]) => tags.map(tag).toSorted();

	// Refer a single tag
	const tag = (tag: string) => {
		if (Object.hasOwn(tagRefs, tag)) {
			tagRefs[tag]++;
		} else {
			tagRefs[tag] = 1;
		}

		// Force-trigger update
		tagRefs = tagRefs;

		return tag;
	};

	const title = `이유찬`;
	const catchphrase = `좋은 코드를 끝없이 갈망하는 개발자, 이유찬입니다.`;
	const intro = `
웹 기반 B2C/B2B 서비스 및 솔루션의 백엔드 개발, 배포 및 운영 경험을 쌓아가고 있는 주니어 백엔드 개발자입니다.

더 좋은 코드를 위해 수시로 개선하기 위해 노력하며 협업을 위한 문서화(Docstring, Swagger)를 습관화하고 가독성 좋은 코드를 작성하기 위해 항상 고민합니다.

다양한 자동화 테스트(pytest, Vitest, Playwright) 및 코드 검사 도구(Mypy, Ruff, ESLint, Checkov)를 개발 환경에 적극적으로 도입하며 실수와 오류를 줄이고 제품 품질을 향상시키기 위해 노력하고 있습니다.

Python 외에도 TypeScript, Rust에도 관심이 많아 토이 프로젝트를 통해 배우고 있습니다.
또한 웹 외에도 브라우저 확장 프로그램, 데스크탑 애플리케이션 등 다양한 소프트웨어 개발 또한 도전하며 지식을 넓혀나가고 있습니다.
  `;

	// TODO: Maintain as separate file for later I18n support + maintainability
	const educations = [
		{
			name: '서울과학기술대학교',
			description: `
컴퓨터공학과 학사, 학점 4.11/4.5
`,
			period: {
				start: new Date('2014-03-02'),
				end: new Date('2020-02-28')
			}
		}
	];

	const certificates = [
		{
			name: '정보처리기능사',
			issuer: '한국산업인력공단',
			issuanceDate: new Date('2015-02-05'),
			description: ``
		},
		{
			name: '정보기기운용기능사',
			issuer: '한국산업인력공단',
			issuanceDate: new Date('2016-12-05'),
			description: ``
		},
		{
			name: 'TOEIC (935/990)',
			issuer: 'ETS',
			issuanceDate: new Date('2018-09-15'),
			description: `935/990`
		},
		{
			name: '정보처리기사',
			issuer: '한국산업인력공단',
			issuanceDate: new Date('2020-08-28'),
			description: ``
		}
	];

	const experiences = [
		{
			organization: '얼리페이',
			role: '백엔드 개발자',
			summary: '얼리페이 카드 및 배달 매출 선정산 서비스 백엔드 개발 및 출시',
			period: {
				start: new Date('2021-06-01'),
				end: new Date('2021-12-31')
			},
			projects: [
				{
					title: '얼리페이 서비스 개발 및 출시',
					period: {
						start: new Date('2021-06-01'),
						end: new Date('2021-12-31')
					},
					description: `
- Django 기반 선정산 서버 개발
  - 데이터베이스 설계 및 ORM 구현
  - Django Admin을 이용한 정산 관리자 페이지 개발
  - SPA FE 웹 애플리케이션과의 통신을 위한 REST API 구현 (DRF)
  - Celery를 이용하여 정기 일괄 작업 처리
  - 여러 내/외부 서비스와 연동 (크롤러, 펌뱅킹, 카카오 알림톡, Slack, etc.)

- 선정산 데이터 수집을 위한 웹 크롤러 개발
  - 기존 Flask 1 기반 크롤러 구현을 FastAPI로 마이그레이션, 전반적인 구조 및 성능 개선
  - VAN (Value-Added Network) / 배달 플랫폼 크롤러 구현

- Etc.
  - 컨테이너 기반 개발 환경 구성 (Docker, Docker Compose, VS Code Devcontainer)
  - 코드 품질 개선을 위한 CQA 도구 도입 (pre-commit, flake8, isort 및 Black / Mypy)
  - pytest를 이용한 자동화 테스트
  - GitHub Actions를 이용하여 서비스 배포 자동화 (AWS Beanstalk)
  - 모니터링 구성 및 연동 (CloudWatch, Sentry)
          `,
					tags: tags(
						'Amazon Web Services',
						'Celery',
						'Django REST Framework',
						'Django',
						'Docker',
						'FastAPI',
						'GitHub Actions',
						'PostgreSQL',
						'Python',
						'Redis',
						'Selenium'
					)
				}
			]
		},
		{
			organization: '에이젠글로벌',
			role: '백엔드 개발자',
			summary: `우리카드 FDS 고도화 프로젝트 및 ABACUS AutoML 솔루션의 개발 및 유지보수`,
			period: {
				start: new Date('2022-12-08'),
				end: new Date('2023-08-31')
			},
			projects: [
				{
					title: 'ABACUS 유지보수',
					period: {
						start: new Date('2022-12-08'),
						end: new Date('2023-08-31')
					},
					description: `
- 레거시 애플리케이션 유지보수
- 고객사 (우리FIS) 장애 대응
- 차세대 AutoMLOps 솔루션 ABACUS Enterprise 설계 및 기획 참여
          `, // TODO
					tags: tags(
						'Celery',
						'Django REST Framework',
						'Django',
						'Docker',
						'NGINX',
						'PostgreSQL',
						'Python',
						'Redis'
					)
				},
				{
					title: '우리카드 FDS 고도화 및 유지보수',
					period: {
						start: new Date('2022-12-08'),
						end: new Date('2023-08-31')
					},
					description: `
- 레거시 우리카드 FDS 시스템의 유지보수 및 신규 기능 개발
  - 일일 약 700만건의 요청을 처리하는 Python Twisted 기반 비동기 TCP 서버 애플리케이션 유지보수
  - 딥러닝 스코어링 요청 처리 다중 프로세스 Python 애플리케이션 유지보수

- 애플리케이션 성능 개선 작업
  - 리소스 사용량 개선을 통한 서버 안정화
  - Locust를 이용한 부하 테스트
  - 레거시 ClickHouse 데이터베이스 성능 개선
          `, // TODO
					tags: tags(
						'ClickHouse',
						'Docker',
						'Locust',
						'NGINX',
						'Python',
						'Redis',
						'SQLite',
						'Twisted'
					)
				}
			]
		},
		{
			organization: '얼리페이',
			role: '백엔드 개발자',
			summary: '재직 중',
			period: {
				start: new Date('2023-12-04'),
				end: new Date(Date.now())
			},
			projects: []
		}
	];

	const personalWorks = [
		{
			name: 'lasuillard.github.io',
			description: `SvelteKit을 이용하여 직접 처음부터 만든 개인 블로그입니다.`,
			link: 'https://github.com/lasuillard/lasuillard.github.io',
			tags: tags('GitHub Actions', 'SvelteKit', 'Tailwind CSS'),
			status: 'WIP',
			order: 0 // Ascending order
		},
		{
			name: 'raindrop-client',
			description: `
Raindrop.io API의 비공식 OpenAPI 스키마 정의 및 자동 생성된 클라이언트 라이브러리입니다.

Raindrop.io에서 제공하지 않는 OpenAPI 스키마를 직접 정의하고 OpenAPI Generator를 이용하여 API 클라이언트 코드를 자동 생성합니다.
[npm](https://www.npmjs.com/package/@lasuillard/raindrop-client)에 배포되어 있습니다.
        `,
			link: 'https://github.com/lasuillard/raindrop-client',
			tags: tags('TypeScript', 'GitHub Actions', 'OpenAPI', 'OpenAPI Generator'),
			status: 'Published',
			order: 1
		},
		{
			name: 'Raindrop Sync for Chrome',
			description:
				'Raindrop.io와 크롬 브라우저간 북마크 동기화 기능을 제공하기 위한 크롬 브라우저 확장 프로그램입니다.',
			link: 'https://github.com/lasuillard/raindrop-sync-chrome',
			tags: tags('Chrome Extension', 'GitHub Actions', 'Svelte', 'Tailwind CSS', 'TypeScript'),
			status: 'WIP',
			order: 2
		},
		{
			name: 'django-slack-tools',
			description: `
Django 프로젝트 내 Slack 메시징 및 봇 개발 편의성을 제공하기 위한 라이브러리입니다.
[PyPI](https://pypi.org/project/django-slack-tools/)에 공개되어 있습니다.
        `,
			link: 'https://github.com/lasuillard/django-slack-tools',
			tags: tags('Python', 'Django', 'Slack', 'GitHub Actions'),
			status: 'Published',
			order: 4
		},
		{
			name: 'mockoon-novnc',
			description: `
Mockoon의 GUI를 웹 브라우저에서 실행할 수 있도록 하는 NoVNC 연동 및 부가 기능을 제공하기 위한 Docker 이미지입니다.

개발 중 모의 서버 구성 및 관리 편의를 위해 개발되었으며, [Docker Hub](https://hub.docker.com/r/lasuillard/mockoon-novnc)에 공개되어 있습니다.
`,
			link: 'https://github.com/lasuillard/mockoon-novnc',
			tags: tags('Docker', 'Mockoon', 'GitHub Actions'),
			status: 'Published',
			order: 5
		}
	];
</script>

<div class="prose max-w-none px-4 py-12">
	<h1>{title}</h1>

	<div class="flex flex-col place-items-end">
		{#if pageURL}
			<QRCode text={pageURL} width={160} />
		{:else}
			<canvas width={160} />
		{/if}
	</div>

	<div>
		<p
			class="my-10 text-center text-lg font-semibold before:content-[open-quote] after:content-[close-quote]"
		>
			{catchphrase}
		</p>
		<Markdown>{intro}</Markdown>
	</div>

	<h2 class="border-l-4 border-teal-500 pl-3">SKILL</h2>
	<div>
		<div class="space-y-1">
			{#each Object.entries(tagRefs).toSorted(([, a], [, b]) => b - a) as [tag, count]}
				<span class="badge badge-info badge-lg mr-2 font-semibold">
					{tag}<span class="badge badge-neutral badge-sm -mr-1 ml-1.5 px-1">{count}</span>
				</span>
			{/each}
		</div>
	</div>

	<!-- TODO: Prettify this -->
	<h2 class="border-l-4 border-sky-600 pl-3">EDUCATION</h2>
	<div>
		{#each educations as edu}
			<h3>{edu.name}</h3>
			<p class="subtext">
				{format(edu.period.start, 'yyyy.MM.dd')} ~ {format(edu.period.end, 'yyyy.MM.dd')}
			</p>
			<Markdown>{edu.description}</Markdown>
		{/each}
	</div>

	<!-- TODO: Prettify this -->
	<h2 class="border-l-4 border-gray-500 pl-3">CERTIFICATE</h2>
	<div>
		{#each certificates.toSorted((a, b) => b.issuanceDate.getTime() - a.issuanceDate.getTime()) as cert}
			<h3>{cert.name}</h3>
			<p class="subtext">{format(cert.issuanceDate, 'yyyy.MM.dd')}</p>
		{/each}
	</div>

	<h2 class="border-l-4 border-red-500 pl-3">EXPERIENCE</h2>
	{#each experiences.toSorted((a, b) => b.period.end.getTime() - a.period.end.getTime()) as expr}
		<h3>{expr.organization}</h3>
		<p class="subtext">
			{format(expr.period.start, 'yyyy.MM.dd')} ~ {format(expr.period.end, 'yyyy.MM.dd')}
		</p>
		<Markdown>{expr.summary}</Markdown>

		<!-- Projects -->
		{#each expr.projects.toSorted((a, b) => b.period.end.getTime() - a.period.end.getTime()) as project}
			<h4>{project.title}</h4>
			<p class="subtext">
				{format(project.period.start, 'yyyy.MM.dd')} ~ {format(project.period.end, 'yyyy.MM.dd')}
			</p>
			<div>
				{#each project.tags as tag}
					<span class="badge badge-info mr-1 font-semibold">{tag}</span>
				{/each}
			</div>
			<Markdown>{project.description}</Markdown>
		{/each}
	{/each}

	<h2 class="border-l-4 border-indigo-700 pl-3">PERSONAL WORK</h2>

	{#each Object.values(personalWorks).toSorted((a, b) => a.order - b.order) as pw}
		<h3>
			<a href={pw.link} target="_blank">{pw.name}</a>
			<span class="badge badge-warning align-middle font-bold">{pw.status}</span>
		</h3>
		<div>
			{#each pw.tags as tag}
				<span class="badge badge-info mr-1 font-semibold">{tag}</span>
			{/each}
		</div>
		<Markdown>{pw.description}</Markdown>
	{/each}
</div>

<style lang="postcss">
	h1 {
		@apply text-5xl font-extrabold;
	}
	h2 {
		@apply text-3xl font-bold;
	}

	h3,
	h4:has(+ p.subtext) {
		@apply !mb-1;
	}

	.subtext {
		@apply text-gray-500;
	}
</style>
