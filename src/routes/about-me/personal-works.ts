export default [
	{
		name: 'lasuillard.github.io',
		description: `SvelteKit을 이용하여 직접 처음부터 만든 개인 블로그입니다.`,
		link: 'https://github.com/lasuillard/lasuillard.github.io',
		tags: ['GitHub Actions', 'SvelteKit', 'Tailwind CSS'],
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
		tags: ['TypeScript', 'GitHub Actions', 'OpenAPI', 'OpenAPI Generator'],
		status: 'Published',
		order: 1
	},
	{
		name: 'Raindrop Sync for Chrome',
		description:
			'Raindrop.io와 크롬 브라우저간 북마크 동기화 기능을 제공하기 위한 크롬 브라우저 확장 프로그램입니다.',
		link: 'https://github.com/lasuillard/raindrop-sync-chrome',
		tags: ['Chrome Extension', 'GitHub Actions', 'Svelte', 'Tailwind CSS', 'TypeScript'],
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
		tags: ['Python', 'Django', 'Slack', 'GitHub Actions'],
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
		tags: ['Docker', 'Mockoon', 'GitHub Actions'],
		status: 'Published',
		order: 5
	}
];
