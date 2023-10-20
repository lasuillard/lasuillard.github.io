<script lang="ts">
	export let text: string;
</script>

{#if text}
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html text}
{/if}
