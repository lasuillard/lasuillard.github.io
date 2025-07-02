<script lang="ts">
	import { browser } from '$app/environment';
	import Markdown from '$components/content/Markdown.svelte';
	import QRCode from '$components/content/QRCode.svelte';
	import Docker from '^/src/components/icon/Docker.svelte';
	import GitHub from '^/src/components/icon/GitHub.svelte';
	import Npm from '^/src/components/icon/npm.svelte';
	import PyPi from '^/src/components/icon/PyPI.svelte';
	import { format, isSameYear } from 'date-fns';
	import { onMount } from 'svelte';

	let { data } = $props();
	const { certificates, educations, experiences, personalWorks } = data;

	const iconMap: { [key: string]: any } = {
		github: GitHub,
		docker: Docker,
		npm: Npm,
		pypi: PyPi
	};

	// Tag reference counter
	const tagRefs: { [key: string]: number } = $state({});

	// Refer a single tag
	// eslint-disable-next-line jsdoc/require-jsdoc
	function _tag(tag: string) {
		if (Object.hasOwn(tagRefs, tag)) {
			tagRefs[tag]++;
		} else {
			tagRefs[tag] = 1;
		}

		return tag;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	function _tags(tags: string[]) {
		return tags.map(_tag);
	}

	// Current page URL to generate QR code
	const pageURL = browser ? window.location.href.split('#')[0] : null;

	// Transform data into timeline format
	type TimelineItem = {
		period: { start: Date; end?: Date };
		title: string;
		summary: string;
		description?: string;
		tags?: string[];
	};

	let eduAsTimeline: TimelineItem[] = $state([]);
	let certsAsTimeline: TimelineItem[] = $state([]);
	let exprAsTimeline: TimelineItem[] = $state([]);
	let timelineItems: TimelineItem[] = $state([]);

	onMount(() => {
		eduAsTimeline = educations.map((edu) => ({
			period: edu.period,
			title: edu.name,
			summary: edu.description
		}));
		certsAsTimeline = certificates.map((cert) => ({
			period: { start: cert.issuanceDate },
			title: cert.name,
			summary: cert.issuer
		}));
		exprAsTimeline = experiences.map((expr) => ({
			period: expr.period,
			title: expr.organization,
			summary: expr.summary,
			description: expr.description,
			tags: _tags(expr.tags)
		}));
		timelineItems = [...eduAsTimeline, ...certsAsTimeline, ...exprAsTimeline].sort(
			(a, b) => new Date(b.period.start).getTime() - new Date(a.period.start).getTime()
		);

		// Previous implementation causing recursion explode; temporary fix
		for (const pw of Object.values(personalWorks)) {
			pw.tags = _tags(pw.tags);
		}
	});
</script>

<div class="prose max-w-none px-4 py-12">
	<h1>이유찬</h1>

	<div class="flex flex-col place-items-end">
		{#if pageURL}
			<QRCode text={pageURL} width={160} />
		{:else}
			<canvas width={160}></canvas>
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
Python을 이용한 백엔드 서비스 개발 경험을 가진 백엔드 개발자입니다. 주로 Django, FastAPI 프레임워크를 사용해 웹 서비스를 개발하고 운영해왔습니다.

가장 선호하는 언어는 Python이지만 TypeScript와 Rust에도 관심이 많아 블로그를 직접 구현하거나 간단한 Rust CLI 애플리케이션을 만들어보며 지평을 넓히고 있습니다.
항상 틀에 얽매이지 않고 새로운 가능성을 열어두고자 합니다.

자동화 테스트 및 코드 검사 도구를 통한 코드 품질 향상에 관심이 많으며 문서화를 중요하게 생각합니다.
언제 다시 보더라도 이해하기 쉬운 코드, 가독성 좋은 코드를 작성하기 위해 노력하고 있습니다.
`}
		</Markdown>
	</div>

	<h2 class="border-l-4 border-teal-500 pl-3">SKILL</h2>
	<div>
		<div class="space-y-1">
			{#each Object.entries(tagRefs).toSorted(([, a], [, b]) => b - a) as [tag, count] (tag)}
				<span class="badge badge-info badge-lg mr-2 font-semibold">
					{tag}<span class="badge badge-neutral badge-sm -mr-1 ml-1.5 px-1">{count}</span>
				</span>
			{/each}
		</div>
	</div>

	<h2 class="border-l-4 border-sky-600 pl-3">HISTORY</h2>
	<div>
		<ul class="max-md:timeline-compact timeline timeline-vertical timeline-snap-icon">
			{#each timelineItems as { period: { start, end }, title, summary, description, tags }, index (index)}
				{@const dir = index % 2 == 0 ? 'left' : 'right'}
				<li class="my-0">
					<hr />
					<div class="timeline-middle">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="h-5 w-5"
						>
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
					<div class="{dir == 'left' ? 'timeline-start md:text-end' : 'timeline-end'} mb-10">
						<time class="font-mono italic">{format(start, 'yyyy. MMMM')}</time>
						{#if end}
							{@const dateFmt = isSameYear(start, end) ? 'MMMM' : 'yyyy. MMMM'}
							<span class="mx-2">~</span><time class="font-mono italic">{format(end, dateFmt)}</time
							>
						{/if}
						<div class="mb-1 text-lg font-black">{title}</div>
						<div class="mb-1">{summary}</div>
						{#if description}
							<div class="prose-sm">
								<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
								<div tabindex="0" class="collapse text-center">
									<input type="checkbox" />
									<div class="collapse-title font-semibold">더 보기</div>
									<div class="collapse-content text-start">
										<Markdown>
											{description}
										</Markdown>
									</div>
								</div>
							</div>
						{/if}
						{#if tags}
							<div class="mt-2 flex flex-wrap {dir == 'left' ? 'justify-end' : ''} gap-1">
								{#each tags as tag (tag)}
									<span class="badge badge-info badge-md font-semibold">{tag}</span>
								{/each}
							</div>
						{/if}
					</div>
					<hr />
				</li>
			{/each}
		</ul>
	</div>

	<h2 class="border-l-4 border-indigo-700 pl-3">PERSONAL WORK</h2>
	<div class="columns-1 gap-8 space-y-8 lg:columns-2 2xl:columns-4 2xl:gap-4 2xl:space-y-4">
		{#each Object.values(personalWorks).toSorted((a, b) => a.order - b.order) as pw (pw.name)}
			<div class="card break-inside-avoid border-2 border-slate-500 shadow-xl">
				<div class="card-body">
					<h2 class="card-title flex-wrap">
						{pw.name}
					</h2>
					<div class="flex justify-end">
						<span class="badge badge-warning font-semibold">{pw.status}</span>
					</div>
					<div class="mt-3 flex justify-end">
						{#each Object.entries(pw.links) as [platform, link] (link)}
							{@const Icon = iconMap[platform]}
							<a href={link} target="_blank" class="btn btn-circle btn-ghost">
								<Icon class="h-7 w-7" />
							</a>
						{/each}
					</div>
					<div>
						<Markdown>{pw.description}</Markdown>
					</div>
					<div class="card-actions mt-auto">
						{#each pw.tags as tag (tag)}
							<span class="badge badge-info font-semibold">{tag}</span>
						{/each}
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	@reference "../../app.css";

	h1 {
		@apply text-5xl font-extrabold;
	}
	h2 {
		@apply text-3xl font-bold;
	}
</style>
