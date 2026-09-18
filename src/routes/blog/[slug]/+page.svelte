<script lang="ts">
	import Markdown from '$components/content/Markdown.svelte';
	import TagBadge from '$components/content/TagBadge.svelte';
	import CalendarDaysIcon from '$components/icon/CalendarDays.svelte';
	import { formatRelativeDate } from '$lib/utils';
	import { format } from 'date-fns';
	import Comment from './Comment.svelte';
	import { ScrollTracker } from './scroll-tracking.svelte.js';
	import ChangelogWidget from './ChangelogWidget.svelte';
	import SeriesWidget from './SeriesWidget.svelte';
	import Toc from './Toc.svelte';

	let { data } = $props();
	const { metadata, content, seriesPosts } = $derived.by(() => {
		return data;
	});
	const today = new Date();

	// HTML element binding used for generating ToC
	let contentWrapper: HTMLElement | undefined = $state();
	let contentIsReady = $state(false);

	const scrollTracker = new ScrollTracker();

	$effect(() => {
		if (!contentWrapper || !contentIsReady) {
			return;
		}
		scrollTracker.init(contentWrapper);

		return () => scrollTracker.destroy();
	});
</script>

<svelte:window
	onclick={(e) => {
		if (!contentWrapper) return;
		scrollTracker.handleAnchorClick(e);
	}}
/>

<div>
	<div class="flex">
		<div class="mx-auto max-w-none lg:max-w-200">
			<header data-testid="article-hero" class="mb-10 lg:mb-16">
				<div data-testid="article-header" class="mt-8 flex flex-col gap-6">
					<div class="flex flex-col gap-4">
						<div class="mb-2 flex flex-wrap gap-2">
							{#each metadata.tags as tag (tag)}
								<TagBadge {tag} />
							{/each}
						</div>
						<h1 class="text-2xl leading-tight font-extrabold md:text-4xl">{metadata.title}</h1>
						<div class="text-base-content/60 mt-2 flex items-center gap-2 font-medium">
							<CalendarDaysIcon class="h-5 w-5" />
							<time datetime={metadata.publicationDate.toISOString()} role="time">
								{formatRelativeDate(metadata.publicationDate, today)}
								({format(metadata.publicationDate, 'yyyy년 M월 d일')})
							</time>
						</div>
						{#if metadata.summary}
							<p class="text-base-content/70 mt-2 text-xl leading-relaxed font-light">
								{metadata.summary}
							</p>
						{/if}
					</div>

					{#if metadata.preview}
						<div class="mt-8 flex w-full justify-center">
							<img
								src={metadata.preview}
								alt="Preview"
								class="max-h-[500px] max-w-full rounded-2xl object-contain drop-shadow-sm"
							/>
						</div>
					{/if}
				</div>
				<div class="divider my-8"></div>
				{#if metadata.changelog && metadata.changelog.length > 0}
					<ChangelogWidget changelogs={metadata.changelog} />
				{/if}
				{#if metadata.series && seriesPosts && seriesPosts.length > 0}
					<SeriesWidget seriesName={metadata.series} {seriesPosts} currentPostId={metadata.id} />
				{/if}
			</header>
			<!-- Floating/Hoverable TOC -->
			{#if contentIsReady}
				<Toc content={contentWrapper} activeId={scrollTracker.activeId} />
			{/if}
			<div bind:this={contentWrapper}>
				<article class="prose prose-sm lg:prose-base mx-auto mt-12 max-w-none wrap-break-word">
					<Markdown bind:ready={contentIsReady}>{content}</Markdown>
				</article>
			</div>
			<Comment />
		</div>
	</div>
</div>
