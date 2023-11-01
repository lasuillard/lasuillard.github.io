<script lang="ts">
	import Markdown from '$components/content/Markdown.svelte';
	import Toc from '$components/content/Toc.svelte';
	import { format } from 'date-fns';

	export let data;

	const { metadata, content } = data;
	const { title, publicationDate, tags } = metadata;

	// Content wrapper for generating ToC
	let contentWrapper: HTMLElement | undefined;
</script>

<div {...$$restProps}>
	<div class="flex">
		<!-- Side TOC for large screen -->
		<div class="ml-8 hidden max-lg:-mr-8 xl:order-last xl:block">
			{#if contentWrapper}
				<Toc bind:content={contentWrapper} class="sticky top-[25rem]" />
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
	article :global(:where(h1, h2, h3, h4, h5, h6) > a) {
		@apply !no-underline;
	}
	article :global(:where(h1, h2, h3, h4, h5, h6) > a:hover) {
		@apply !underline;
	}

	article :global(img) {
		@apply mx-auto; /* Align center */
	}

	article :global(h1) {
		@apply mt-12;
	}
</style>
