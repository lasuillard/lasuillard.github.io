<script lang="ts">
	import { format } from 'date-fns';

	export let data;

	const { metadata, content } = data;
	const { title, publicationDate, tags } = metadata;
</script>

<div {...$$restProps}>
	<h1 class="text-center text-5xl font-bold">{title}</h1>
	<p class="mt-10 text-end text-xl font-light">
		Published at {format(publicationDate, 'yyyy.MM.dd')}
	</p>
	<div class="ml-2 mt-6 space-x-1 space-y-1">
		{#each tags as tag}
			<div class="badge badge-neutral p-3 font-semibold">
				<a href="/blog/tag/{tag}">
					{tag}
				</a>
			</div>
		{/each}
	</div>
	<div class="divider mb-8" />
	<svelte:component this={content} />
</div>
