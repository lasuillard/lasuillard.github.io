<script lang="ts">
	import TocTree from './TocTree.svelte';
	import { makeToc, type TreeNode, type TreeSource } from '$lib/toc';
	import { onMount } from 'svelte';

	interface Props {
		content: HTMLElement | undefined;
		activeId?: string;
	}

	let { content = $bindable(), activeId = '' }: Props = $props();
	let rootHeadings: TreeNode<HTMLElement>[] = $state([]);
	let isHovered = $state(false);

	onMount(() => {
		if (!content) {
			console.error('Content element not available.');
			return;
		}

		const headings = [...content.querySelectorAll('h1, h2, h3, h4, h5, h6')].map(
			(elem) => elem as HTMLElement
		);
		const root = {
			data: null,
			children: [] as TreeNode<HTMLElement>[]
		};
		const items: TreeSource<HTMLElement, HTMLElement>[] = headings.map((v) => ({
			data: v,
			children: [],
			compare(other: TreeSource<HTMLElement, HTMLElement>): number {
				const left = this.data.tagName;
				const right = other.data.tagName;
				return left < right ? -1 : left == right ? 0 : 1;
			},
			toNode() {
				return {
					data: this.data,
					children: []
				};
			}
		}));
		makeToc(root, items);
		rootHeadings = root.children;
	});
</script>

<div
	role="button"
	tabindex="0"
	aria-label="목차"
	aria-expanded={isHovered}
	data-testid="toc"
	class={'fixed top-1/3 right-4 z-50 cursor-pointer transition-all duration-300 select-none ' +
		(isHovered
			? 'rounded-box border-base-content/10 bg-base-100/95 max-h-[60vh] max-w-[80vw] overflow-y-auto border p-4 shadow-xl backdrop-blur-xs'
			: 'border-transparent bg-transparent p-2 shadow-none')}
	onmouseenter={() => {
		isHovered = true;
	}}
	onmouseleave={() => {
		isHovered = false;
	}}
	onclick={(e) => {
		const target = e.target as HTMLElement;
		if (target.closest('a')) return;
		isHovered = !isHovered;
	}}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			const target = e.target as HTMLElement;
			if (target.closest('a')) return;
			e.preventDefault();
			isHovered = !isHovered;
		}
	}}
>
	<div>
		{#each rootHeadings as root (root.data.textContent)}
			<TocTree tree={root} {activeId} {isHovered} />
		{/each}
	</div>
</div>
