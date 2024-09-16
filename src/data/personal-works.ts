export type PersonalWorkItem = {
	name: string;
	description: string;
	links: {
		github?: string;
		docker?: string;
		npm?: string;
		pypi?: string;
	};
	tags: string[];
	status: PersonalWorkStatus;
	order: number;
};

export enum PersonalWorkStatus {
	WIP = '🛠️ WIP',
	Published = '🚀 Published'
}

export default [
	{
		name: 'lasuillard.github.io',
		description: `SvelteKit을 이용하여 만든 개인 블로그입니다.`,
		links: {
			github: 'https://github.com/lasuillard/lasuillard.github.io'
		},
		tags: ['GitHub Actions', 'SvelteKit', 'Tailwind CSS', 'TypeScript'],
		status: PersonalWorkStatus.Published,
		order: 0
	},
	{
		name: 'raindrop-client',
		description: `
Raindrop.io API의 비공식 OpenAPI 스키마 정의 및 자동 생성된 클라이언트 라이브러리입니다.

OpenAPI 스키마를 직접 정의하고 OpenAPI Generator를 이용하여 API 클라이언트 코드를 자동 생성합니다.
      `,
		links: {
			github: 'https://github.com/lasuillard/raindrop-client',
			npm: 'https://www.npmjs.com/package/@lasuillard/raindrop-client'
		},
		tags: ['TypeScript', 'GitHub Actions', 'OpenAPI', 'OpenAPI Generator'],
		status: PersonalWorkStatus.Published,
		order: 1
	},
	{
		name: 'Raindrop Sync for Chrome',
		description:
			'Raindrop.io와 크롬 브라우저간 북마크 동기화 기능을 제공하기 위한 크롬 브라우저 확장 프로그램입니다.',
		links: {
			github: 'https://github.com/lasuillard/raindrop-sync-chrome'
		},
		tags: ['Chrome Extension', 'GitHub Actions', 'Svelte', 'Tailwind CSS', 'TypeScript'],
		status: PersonalWorkStatus.WIP,
		order: 2
	},
	{
		name: 'django-slack-tools',
		description: `Django 애플리케이션에 특화된 다양한 Slack 통합 기능을 제공하기 위한 Django 앱입니다.`,
		links: {
			github: 'https://github.com/lasuillard/django-slack-tools',
			pypi: 'https://pypi.org/project/django-slack-tools/'
		},
		tags: ['Python', 'Django', 'Slack', 'GitHub Actions'],
		status: PersonalWorkStatus.Published,
		order: 4
	},
	{
		name: 'mockoon-novnc',
		description: `
Mockoon의 GUI를 웹 브라우저에서 실행할 수 있도록 하는 NoVNC 연동 및 부가 기능을 제공하기 위한 Docker 이미지입니다.

개발 중 모의 서버 구성 및 관리 편의를 위해 만들어졌습니다.
`,
		links: {
			github: 'https://github.com/lasuillard/mockoon-novnc',
			docker: 'https://hub.docker.com/r/lasuillard/mockoon-novnc'
		},
		tags: ['Docker', 'NGINX', 'GitHub Actions', 'Shell Scripting'],
		status: PersonalWorkStatus.Published,
		order: 5
	},
	{
		name: 'freerdp-novnc',
		description: `
컨테이너에서 FreeRDP를 이용하여 RDP 세션을 맺고 NoVNC를 통해 웹 UI로 노출하는 Docker 이미지입니다.

Windows OS 기반 스크래핑 중 특수한 요구사항을 충족하기 위해 개발되었습니다.
    `,
		links: {
			github: 'https://github.com/lasuillard/freerdp-novnc',
			docker: 'https://hub.docker.com/r/lasuillard/freerdp-novnc'
		},
		tags: ['Docker', 'GitHub Actions', 'Shell Scripting'],
		status: PersonalWorkStatus.Published,
		order: 6
	},
	{
		name: '1Password Exporter',
		description: `1Password CLI를 이용하여 1Password의 여러 지표를 수집하기 위한 Rust 프로젝트입니다.`,
		links: {
			github: 'https://github.com/lasuillard/1password-exporter',
			docker: 'https://hub.docker.com/r/lasuillard/1password-exporter'
		},
		tags: ['Rust', 'Prometheus', 'Docker', '1Password'],
		status: PersonalWorkStatus.Published,
		order: 7
	}
] as PersonalWorkItem[];
