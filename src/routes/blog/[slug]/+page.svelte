<script lang="ts">
	import Comment from '$components/content/Comment.svelte';
	import Markdown from '$components/content/Markdown.svelte';
	import Toc from '$components/content/Toc.svelte';
	import SeriesWidget from '$components/content/SeriesWidget.svelte';
	import { format, formatDistanceStrict } from 'date-fns';
	import { ScrollTracker } from './scroll-tracking.svelte.js';

	let { data } = $props();
	const { metadata, content, seriesPosts } = $derived.by(() => {
		return data;
	});

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

		import('mermaid').then(({ default: mermaid }) => {
			console.debug('Mermaid loaded. Running...');
			mermaid.run();
		});

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
		<div class="mx-auto max-w-none lg:max-w-[50rem]">
			<div class="mt-6 flex flex-col items-center gap-4 sm:gap-6">
				{#if metadata.preview}
					<img
						src={metadata.preview}
						alt="Preview"
						class="h-auto w-full flex-shrink-0 rounded-xs object-contain sm:h-48 sm:w-48"
					/>
				{/if}
				<div class="flex w-full flex-1 flex-col items-center">
					<h1 class="text-center text-2xl font-bold md:text-3xl">{metadata.title}</h1>
					<p class="mt-4 text-center font-light md:text-base">
						<time datetime={metadata.publicationDate.toISOString()} role="time">
							{formatDistanceStrict(metadata.publicationDate, new Date(), { addSuffix: true })}
							({format(metadata.publicationDate, 'yyyy년 M월 d일')})
						</time>
					</p>
					{#if metadata.summary}
						<p class="mt-2 text-center font-light text-gray-500 md:mt-4 md:text-lg">
							{metadata.summary}
						</p>
					{/if}
					<div class="mt-4 flex flex-wrap justify-center">
						{#each metadata.tags as tag (tag)}
							<div class="badge badge-secondary mr-2 mb-2 rounded-xs p-3 font-semibold">
								<a href="/blog/tag/{tag}">
									{tag}
								</a>
							</div>
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
				<article class="prose prose-sm lg:prose-base mx-auto mt-12 max-w-none break-words">
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

<style lang="postcss">
	@reference "../../../app.css";

	article {
		& :global(figure figcaption) {
			@apply text-center;
		}

		/* Center image and add some shadow for visual recognition */
		& :global(img) {
			@apply mx-auto shadow-md;
		}
		/* No underline for heading links */
		& :global(:where(h1, h2, h3, h4, h5, h6)) {
			scroll-margin-top: 80px;
		}
		& :global(:where(h1, h2, h3, h4, h5, h6) > a) {
			@apply no-underline;
		}
		/* Show '#' on the left of heading links when hover */
		& :global(:where(h1, h2, h3, h4, h5, h6) > a:hover) {
			@apply before:text-secondary before:absolute before:-ml-6 before:underline before:underline-offset-4 before:content-['#'];
		}
		/* Add some shadow for visual recognition */
		& :global(pre) {
			@apply m-2 p-0 text-wrap;
		}
		/* Center Mermaid diagram horizontally */
		& :global(pre.mermaid svg) {
			@apply mx-auto p-2;
		}
	}
</style>
