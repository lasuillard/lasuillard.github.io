<script lang="ts">
	import { parse } from '$lib/markdown';
	import { onMount } from 'svelte';

	let {
		// Parsed front matter and content
		frontMatter = $bindable(undefined),
		content = $bindable(''),
		// Whether the content is ready to be displayed
		ready = $bindable(false),
		// Child elements to render if no content is provided
		children
	} = $props();

	// Binding wrapper used to obtain input slot contents
	let wrapper: HTMLElement | undefined = $state();

	onMount(async () => {
		if (content) {
			return;
		}
		({ frontMatter, content } = await parse(wrapper?.textContent || ''));

		console.debug('Content is ready to be displayed.');
		ready = true;
	});
</script>

{#if content}
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html content}
{:else}
	<div bind:this={wrapper} class="hidden">
		{@render children?.()}
	</div>
{/if}
