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
		summary: '카드/배달 매출 선정산 서비스 개발 및 출시',
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
		period: {
			start: new Date('2021-06-01'),
			end: new Date('2021-12-31')
		},
		tags: [
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
		]
	},
	{
		organization: '에이젠글로벌',
		role: '백엔드 개발자',
		summary: '우리카드 FDS 고도화 프로젝트 참여 및 ABACUS AutoML 솔루션의 개발 및 유지보수',
		description: `

- 레거시 우리카드 FDS 시스템의 유지보수 및 신규 기능 개발
- 일일 약 700만건의 요청을 처리하는 Python Twisted 기반 비동기 TCP 서버 애플리케이션 유지보수
- 딥러닝 스코어링 요청 처리 다중 프로세스 Python 애플리케이션 유지보수

- 애플리케이션 성능 개선 작업
- 리소스 사용량 개선을 통한 서버 안정화
- Locust를 이용한 부하 테스트
- 레거시 ClickHouse 데이터베이스 성능 개선

ABACUS

- 레거시 애플리케이션 유지보수
- 고객사 (우리FIS) 장애 대응
- 차세대 AutoMLOps 솔루션 ABACUS Enterprise 설계 및 기획 참여
`,
		period: {
			start: new Date('2022-12-08'),
			end: new Date('2023-08-31')
		},
		tags: ['ClickHouse', 'Docker', 'NGINX', 'Python', 'Redis', 'SQLite', 'Twisted']
	},
	{
		organization: '얼리페이',
		role: '백엔드 개발자',
		summary: '얼리페이 시스템 개발 및 유지보수',
		description: '',
		period: {
			start: new Date('2023-12-04'),
			end: new Date(Date.now())
		},
		tags: [
			'Amazon Web Services',
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
