<script lang="ts">
	import Markdown from '$components/content/Markdown.svelte';
	import TagBadge from '$components/content/TagBadge.svelte';
	import CalendarDaysIcon from '$components/icon/CalendarDays.svelte';
	import { format, formatDistanceStrict, isSameDay } from 'date-fns';
	import Comment from './Comment.svelte';
	import { ScrollTracker } from './scroll-tracking.svelte.js';
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

	// Take action when the content is ready
	$effect(() => {
		if (!contentIsReady) {
			console.debug('Content is not ready yet. Skipping patching.');
			return;
		}

		// Monkey-patching footnote label (add emoji and translate)
		const footnoteLabel = contentWrapper?.querySelector('#footnote-label > a');
		if (footnoteLabel) {
			footnoteLabel.innerHTML = '각주'; // TODO: I18n
			footnoteLabel.innerHTML = '🔗 ' + footnoteLabel.innerHTML;
		} else {
			console.debug('Footnote label not found. Skipping patching.');
		}
	});

	$effect(() => {
		if (!contentWrapper || !contentIsReady) {
			return;
		}
		scrollTracker.doInit(contentWrapper);

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
			<div class="mt-6 flex flex-col items-center gap-4 sm:gap-6">
				{#if metadata.preview}
					<img
						src={metadata.preview}
						alt="Preview"
						class="h-auto w-full shrink-0 rounded-lg object-contain sm:h-48 sm:w-48"
					/>
				{/if}
				<div class="flex w-full flex-1 flex-col items-center">
					<h1 class="text-center text-2xl font-bold md:text-3xl">{metadata.title}</h1>
					<p class="mt-4 text-center font-light md:text-base">
						<CalendarDaysIcon class="mr-1 inline-block h-5 w-5 align-text-bottom text-gray-500" />
						<time datetime={metadata.publicationDate.toISOString()} role="time">
							{isSameDay(metadata.publicationDate, today)
								? '오늘'
								: formatDistanceStrict(metadata.publicationDate, today, { addSuffix: true })}
							({format(metadata.publicationDate, 'yyyy년 M월 d일')})
						</time>
					</p>
					{#if metadata.summary}
						<p class="mt-2 text-center font-light text-gray-500 md:mt-4 md:text-lg">
							{metadata.summary}
						</p>
					{/if}
					<div class="mt-8 flex flex-wrap justify-center gap-2">
						{#each metadata.tags as tag (tag)}
							<TagBadge {tag} />
						{/each}
					</div>
				</div>
			</div>
			<div class="divider mb-6"></div>
			<!-- Floating/Hoverable TOC -->
			{#if contentIsReady}
				<Toc content={contentWrapper} activeId={scrollTracker.activeId} />
			{/if}
			<div bind:this={contentWrapper}>
				<article class="prose prose-sm lg:prose-base mx-auto mt-12 max-w-none wrap-break-word">
					<Markdown bind:ready={contentIsReady}>{content}</Markdown>
				</article>
			</div>
			{#if metadata.series && seriesPosts && seriesPosts.length > 0}
				<SeriesWidget seriesName={metadata.series} {seriesPosts} currentPostId={metadata.id} />
			{/if}
			<Comment />
		</div>
	</div>
</div>
