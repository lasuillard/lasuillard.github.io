<script lang="ts">
	import { browser } from '$app/environment';
	import Markdown from '$components/content/Markdown.svelte';
	import QRCode from '$components/content/QRCode.svelte';
	import Timeline from '$components/content/Timeline.svelte';
	import certificates from '$data/certificates';
	import educations from '$data/educations';
	import experiences from '$data/experiences';
	import personalWorks from '$data/personal-works';
	import Docker from '^/src/components/icon/Docker.svelte';
	import GitHub from '^/src/components/icon/GitHub.svelte';
	import Npm from '^/src/components/icon/npm.svelte';
	import PyPi from '^/src/components/icon/PyPI.svelte';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const iconMap: { [key: string]: any } = {
		github: GitHub,
		docker: Docker,
		npm: Npm,
		pypi: PyPi
	};

	// Tag reference counter
	let tagRefs: { [key: string]: number } = {};

	// Refer a single tag
	// eslint-disable-next-line jsdoc/require-jsdoc
	function _tag(tag: string) {
		if (Object.hasOwn(tagRefs, tag)) {
			tagRefs[tag]++;
		} else {
			tagRefs[tag] = 1;
		}

		// Force-trigger update
		tagRefs = tagRefs;

		return tag;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	function _tags(tags: string[]) {
		return tags.map(_tag);
	}

	// Current page URL to generate QR code
	const pageURL = browser ? window.location.href.split('#')[0] : null;

	// Transform data into timeline format
	const eduAsTimeline = educations.map((edu) => ({
		period: edu.period,
		title: edu.name,
		description: edu.description
	}));
	const certsAsTimeline = certificates.map((cert) => ({
		period: { start: cert.issuanceDate },
		title: cert.name,
		description: cert.issuer
	}));
	const exprAsTimeline = experiences.map((expr) => ({
		period: expr.period,
		title: expr.organization,
		description: expr.summary,
		tags: _tags(Array.from(new Set(expr.projects.flatMap((p) => p.tags))))
	}));
	const timelineItems = [...eduAsTimeline, ...certsAsTimeline, ...exprAsTimeline].sort(
		(a, b) => new Date(b.period.start).getTime() - new Date(a.period.start).getTime()
	);
</script>

<div class="prose max-w-none px-4 py-12">
	<h1>이유찬</h1>

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
			좋은 코드를 끝없이 갈망하는 개발자, 이유찬입니다.
		</p>
		<Markdown>
			{`
웹 기반 B2C/B2B 서비스 및 솔루션의 백엔드 개발, 배포 및 운영 경험을 쌓아가고 있는 주니어 백엔드 개발자입니다.

더 좋은 코드를 위해 수시로 개선하기 위해 노력하며 협업을 위한 문서화(Docstring, Swagger)를 습관화하고 가독성 좋은 코드를 작성하기 위해 항상 고민합니다.

다양한 자동화 테스트(pytest, Vitest, Playwright) 및 코드 검사 도구(Mypy, Ruff, ESLint, Checkov)를 개발 환경에 적극적으로 도입하며 실수와 오류를 줄이고 제품 품질을 향상시키기 위해 노력하고 있습니다.

Python 외에도 TypeScript, Rust에도 관심이 많아 토이 프로젝트를 통해 배우고 있습니다.
또한 웹 외에도 브라우저 확장 프로그램, 데스크탑 애플리케이션 등 다양한 소프트웨어 개발 또한 도전하며 지식을 넓혀나가고 있습니다.
`}
		</Markdown>
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

	<h2 class="border-l-4 border-sky-600 pl-3">HISTORY</h2>
	<div class="not-prose">
		<Timeline items={timelineItems} />
	</div>

	<h2 class="border-l-4 border-indigo-700 pl-3">PERSONAL WORK</h2>
	<div class="grid grid-cols-1 gap-8 lg:grid-cols-2 2xl:grid-cols-4">
		{#each Object.values(personalWorks).toSorted((a, b) => a.order - b.order) as pw}
			<div class="card bg-slate-800 shadow-xl">
				<div class="card-body">
					<h2 class="card-title flex-wrap text-neutral-content">
						{pw.name}
						<div class="badge badge-warning">{pw.status}</div>
					</h2>
					<div class="flex justify-end">
						{#each Object.entries(pw.links) as [platform, link]}
							{@const Icon = iconMap[platform]}
							<a href={link} target="_blank" class="btn btn-circle btn-ghost">
								<svelte:component this={Icon} class="h-7 w-7" />
							</a>
						{/each}
					</div>
					<div class="text-neutral-content">
						<Markdown>{pw.description}</Markdown>
					</div>
					<div class="card-actions mt-auto">
						{#each pw.tags as tag}
							<span class="badge badge-info font-semibold">{_tag(tag)}</span>
						{/each}
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style lang="postcss">
	h1 {
		@apply text-5xl font-extrabold;
	}
	h2 {
		@apply text-3xl font-bold;
	}
</style>
