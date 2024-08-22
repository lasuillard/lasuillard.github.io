<script lang="ts">
	import { parse } from '$lib/markdown';
	import { onMount } from 'svelte';

	/**
	 * Front matters extracted from markdown text (slot).
	 *
	 * This isn't used inside component, export only.
	 */
	export let frontMatter: unknown | undefined = undefined;

	/**
	 * Parsed HTML text from markdown.
	 *
	 * This exists to provide common functionality (such as styles, highlights, auto link headings, etc.)
	 * to markdown HTML documents.
	 *
	 * Just ignore this to use slotted inputs for raw markdown text.
	 */
	export let content: string;

	// Binding wrapper for input slot to obtain its contents
	let wrapper: HTMLElement;

	onMount(async () => {
		if (content) return;

		({ frontMatter, content } = await parse(wrapper?.textContent || ''));
	});
</script>

{#if content}
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html content}
{:else}
	<div bind:this={wrapper} class="hidden">
		<slot />
	</div>
{/if}
