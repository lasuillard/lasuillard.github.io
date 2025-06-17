<script lang="ts">
	import Comment from '$components/content/Comment.svelte';
	import Markdown from '$components/content/Markdown.svelte';
	import Toc from '$components/content/Toc.svelte';
	import { format } from 'date-fns';
	import { onMount } from 'svelte';

	let { data } = $props();
	const { metadata, content } = data;
	const { title, publicationDate, tags } = metadata;

	// HTML element binding used for generating ToC
	let contentWrapper: HTMLElement | undefined = $state();
	let contentIsReady = $state(false);

	// Take action when the content is ready
	$effect(() => {
		if (!contentIsReady) {
			console.debug('Content is not ready yet. Skipping patching.');
			return;
		}

		// Monkey-patching footnote label (add emoji and translate)
		const footnoteLabel = contentWrapper?.querySelector('#footnote-label > a');
		if (!footnoteLabel) {
			console.debug('Footnote label not found. Skipping patching.');
			return;
		}
		footnoteLabel.innerHTML = '각주'; // TODO: I18n
		footnoteLabel.innerHTML = '🔗 ' + footnoteLabel.innerHTML;
	});

	onMount(() => {
		import('mermaid').then(({ default: mermaid }) => mermaid.run());
	});
</script>

<div>
	<div class="flex">
		<!-- Side TOC for large screen -->
		<div class="ml-8 hidden max-lg:-mr-8 xl:order-last xl:block">
			{#if contentIsReady}
				<Toc content={contentWrapper} class="h-md:sticky h-md:top-[10%] h-lg:top-[20%]" />
			{/if}
		</div>
		<div class="mx-auto max-w-full">
			<h1 class="text-center text-4xl font-bold md:text-5xl">{title}</h1>
			<p class="mt-4 text-end font-light md:mt-10 md:text-xl">
				Published at {format(publicationDate, 'yyyy.MM.dd')}
			</p>
			<div class="mt-4 ml-2 space-y-1 md:mt-6">
				{#each tags as tag (tag)}
					<div class="badge badge-secondary mr-2 rounded-xs p-3 font-semibold">
						<a href="/blog/tag/{tag}">
							{tag}
						</a>
					</div>
				{/each}
			</div>
			<div class="divider mb-6"></div>
			<!-- Embedded TOC for small screen -->
			<div class="xl:hidden">
				{#if contentIsReady}
					<Toc content={contentWrapper} class="mb-6" />
				{/if}
			</div>
			<div bind:this={contentWrapper}>
				<article class="prose prose-sm lg:prose-base mt-12 max-w-none break-words lg:max-w-[60vw]">
					<Markdown bind:ready={contentIsReady}>{content}</Markdown>
				</article>
			</div>
			<Comment />
		</div>
	</div>
</div>

<style>
	@reference "../../../app.css";

	article {
		/* Center image and add some shadow for visual recognition */
		& :global(img) {
			@apply mx-auto shadow-md;
		}
		/* No underline for heading links */
		& :global(:where(:global(h1, h2, h3, h4, h5, h6)) > a) {
			@apply no-underline;
		}
		/* Show '#' on the left of heading links when hover */
		& :global(:where(:global(h1, h2, h3, h4, h5, h6)) > a:hover) {
			@apply before:text-secondary before:absolute before:-ml-6 before:underline before:underline-offset-4 before:content-['#'];
		}
		/* Add some shadow for visual recognition */
		& :global(pre) {
			@apply shadow-md;
		}
		/* Center Mermaid diagram horizontally */
		& :global(pre.mermaid svg) {
			@apply mx-auto;
		}
	}
</style>
