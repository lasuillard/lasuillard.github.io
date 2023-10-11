<script lang="ts">
	import { format } from 'date-fns';

	export let data;

	const { metadata, content } = data;
	const { title, publicationDate, tags } = metadata;
</script>

<div {...$$restProps}>
	<h1 class="font-bold text-5xl text-center">{title}</h1>
	<p class="font-light text-xl text-end mt-10">
		Published at {format(publicationDate, 'yyyy.MM.dd')}
	</p>
	<div class="space-x-1 space-y-1 ml-2 mt-6">
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
