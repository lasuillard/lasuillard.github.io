export type ExperienceItem = {
	organization: string;
	role: string;
	summary: string;
	description: string;
	period: {
		start: Date;
		end: Date;
	};
	tags: string[];
};

export default [
	{
		organization: '얼리페이',
		role: '백엔드 개발자',
		summary: '오프라인 매출 선정산 서비스 개발 및 출시',
		description: `
**선정산 서비스 개발**

- Django 프레임워크를 이용하여 웹 애플리케이션 개발
- Django REST Framework를 이용한 RESTful API 서버 개발
- Celery를 이용하여 비동기 작업 처리
- GitHub Actions와 AWS Beanstalk을 이용한 배포 자동화

**매출 데이터 수집을 위한 웹 크롤러 개발**

- 기존 Flask 1 기반 크롤러 구현을 FastAPI로 마이그레이션
- VAN / 배달 플랫폼 크롤러 구현
`,
		period: {
			start: new Date('2021-06-01'),
			end: new Date('2021-12-31')
		},
		tags: [
			'AWS Elastic Beanstalk',
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
		]
	},
	{
		organization: '에이젠글로벌',
		role: '백엔드 개발자',
		summary: '우리카드 FDS 고도화 프로젝트 참여 및 ABACUS AutoML 솔루션의 개발 및 유지보수',
		description: `
**우리카드 FDS 고도화**

- 일일 약 700만건의 요청을 처리하는 Python Twisted 기반 FDS 스코어링 서버의 유지보수 및 기능 개발
- ClickHouse를 이용한 대용량 데이터 처리 및 분석

**ABACUS AutoML 솔루션의 개발 및 유지보수**
`,
		period: {
			start: new Date('2022-12-08'),
			end: new Date('2023-08-31')
		},
		tags: ['ClickHouse', 'Docker Compose', 'Python', 'Redis', 'Twisted']
	},
	{
		organization: '얼리페이',
		role: '백엔드 개발자',
		summary: '얼리페이 시스템 개발 및 유지보수',
		description: `
**인프라 구축 및 관리**

- Terraform을 이용한 AWS 인프라 구축 및 관리
- 보안 취약점 점검 및 보완
- 모니터링 시스템 구축 및 관리
- 노후 인프라(DB 및 워크로드)의 업그레이드 및 마이그레이션
- 모든 CI/CD 파이프라인 구축 및 관리

**선정산 서비스 개발 및 유지보수**

- Django 서버 유지보수 및 기능 개발
- Celery를 이용하여 비동기 작업 처리

**크롤러 개발 및 유지보수**

- Docker + AWS Lambda 크롤러 배포 환경 구축
- Windows Server 환경에서 동작하는 크롤러 구현
`,
		period: {
			start: new Date('2023-12-04'),
			end: new Date(Date.now())
		},
		tags: [
			'Amazon Web Services',
			'AWS Lambda',
			'AWS Elastic Container Service',
			'Celery',
			'Django',
			'Docker',
			'FastAPI',
			'GitHub Actions',
			'PostgreSQL',
			'Python',
			'Redis',
			'Selenium',
			'MySQL',
			'Terraform',
			'Windows Server'
		]
	}
] as ExperienceItem[];
