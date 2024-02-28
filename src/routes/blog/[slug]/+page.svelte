<script lang="ts">
	import Markdown from '$components/content/Markdown.svelte';
	import Toc from '$components/content/Toc.svelte';
	import { format } from 'date-fns';
	import mermaid from 'mermaid';
	import { onMount } from 'svelte';

	export let data;

	const { metadata, content } = data;
	const { title, publicationDate, tags } = metadata;

	// Content wrapper for generating ToC
	let contentWrapper: HTMLElement | undefined;

	onMount(() => {
		mermaid.init();

		// Monkey-patching I18n for footnote label
		const footnoteLabel = contentWrapper?.querySelector('#footnote-label > a');
		if (!footnoteLabel) {
			console.debug('Footnote label not found, skip applying I18n for this');
			return;
		}
		footnoteLabel.innerHTML = '각주'; // TODO: I18n
		footnoteLabel.innerHTML = '🔗 ' + footnoteLabel.innerHTML;
	});
</script>

<div {...$$restProps}>
	<div class="flex">
		<!-- Side TOC for large screen -->
		<div class="max-lg:-mr-8 ml-8 hidden xl:order-last xl:block">
			{#if contentWrapper}
				<Toc bind:content={contentWrapper} class="h-md:sticky h-md:top-[10%] h-lg:top-[20%]" />
			{/if}
		</div>
		<div class="mx-auto max-w-full">
			<h1 class="text-center text-4xl font-bold md:text-5xl">{title}</h1>
			<p class="mt-4 text-end font-light md:mt-10 md:text-xl">
				Published at {format(publicationDate, 'yyyy.MM.dd')}
			</p>
			<div class="ml-2 mt-4 space-y-1 md:mt-6">
				{#each tags as tag}
					<div class="badge badge-secondary mr-2 rounded-sm p-3 font-semibold">
						<a href="/blog/tag/{tag}">
							{tag}
						</a>
					</div>
				{/each}
			</div>
			<div class="divider mb-6" />
			<!-- Embedded TOC for small screen -->
			<div class="xl:hidden">
				{#if contentWrapper}
					<Toc bind:content={contentWrapper} class="mb-6" />
				{/if}
			</div>
			<article
				bind:this={contentWrapper}
				class="prose prose-sm mt-12 max-w-none break-words lg:prose-base lg:max-w-[60vw]"
			>
				<Markdown {content} />
			</article>
		</div>
	</div>
</div>

<style lang="postcss">
	article {
		/* Center image and add some shadow for visual recognition */
		& :global(img) {
			@apply mx-auto shadow-md;
		}
		/* No underline for heading links */
		& :global(:where(h1, h2, h3, h4, h5, h6) > a) {
			@apply no-underline;
		}
		/* Show '#' on the left of heading links when hover */
		& :global(:where(h1, h2, h3, h4, h5, h6) > a:hover) {
			@apply before:absolute before:-ml-6 before:text-secondary before:underline before:underline-offset-4 before:content-['#'];
		}
		/* Give some space between text and underline */
		& :global(a) {
			@apply underline-offset-4;
		}
		/* Add some shadow for visual recognition */
		& :global(pre) {
			@apply shadow-md;
		}
	}
</style>
