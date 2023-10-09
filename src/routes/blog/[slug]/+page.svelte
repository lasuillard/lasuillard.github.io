<script lang="ts">
	import { formatDate } from '$lib/time';

	export let data;

	const { metadata, content } = data;
	const { title, publicationDate, tags } = metadata;
</script>

<div {...$$restProps}>
	<h1 class="font-bold text-5xl text-center">{title}</h1>
	<p class="font-light text-xl text-end mt-10">Published at {formatDate(publicationDate)}</p>
	<div class="space-x-1 space-y-1 ml-2 mt-6">
		<!-- TODO: Attach link to tag -->
		{#each tags as tag}
			<div class="badge badge-neutral p-3 font-semibold">{tag}</div>
		{/each}
	</div>
	<div class="divider mb-8" />
	<svelte:component this={content} />
</div>
