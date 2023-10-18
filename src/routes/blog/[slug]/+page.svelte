<script lang="ts">
	import Toc from '$components/Toc.svelte';
	import { format } from 'date-fns';

	export let data;

	const { metadata, content } = data;
	const { title, publicationDate, tags } = metadata;

	let contentWrapper: HTMLElement | undefined;
</script>

<div {...$$restProps}>
	<div class="grid grid-flow-row grid-cols-1 lg:grid-flow-col lg:grid-cols-7">
		<!-- Side TOC for large screen -->
		<div class="class ml-6 hidden lg:order-last lg:col-span-2 lg:block">
			{#if contentWrapper}
				<Toc bind:content={contentWrapper} class="sticky top-1/3" />
			{/if}
		</div>
		<div class="lg:col-span-5">
			<h1 class="text-center text-4xl font-bold md:text-5xl">{title}</h1>
			<p class="mt-4 text-end font-light md:mt-10 md:text-xl">
				Published at {format(publicationDate, 'yyyy.MM.dd')}
			</p>
			<div class="ml-2 mt-4 space-x-1 space-y-1 md:mt-6">
				{#each tags as tag}
					<div class="badge badge-neutral p-3 font-semibold">
						<a href="/blog/tag/{tag}">
							{tag}
						</a>
					</div>
				{/each}
			</div>
			<div class="divider mb-4" />
			<!-- Embedded TOC for small screen -->
			<div class="lg:hidden">
				{#if contentWrapper}
					<Toc bind:content={contentWrapper} class="mb-6" />
				{/if}
			</div>
			<div bind:this={contentWrapper}>
				<svelte:component this={content} />
			</div>
		</div>
	</div>
</div>
