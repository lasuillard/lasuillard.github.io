<script lang="ts">
	export let data;

	const { metadata, content } = data;
	const { title, publicationDate, tags } = metadata;

	/**
	 * Format given date in format of "YYYY.MM.DD".
	 * @param date Date to format.
	 * @returns Formatted string.
	 */
	function formatDate(date: Date): string {
		const fullMonth = (date.getMonth() + 1).toString().padStart(2, '0');
		const fullDay = (date.getDay() + 1).toString().padStart(2, '0');

		return `${date.getFullYear()}.${fullMonth}.${fullDay}`;
	}
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
