<script lang="ts">
	import TocTree from '$components/content/TocTree.svelte';
	import { makeToc, type TreeNode, type TreeSource } from '$lib/toc';
	import { onMount } from 'svelte';

	interface Props {
		content: HTMLElement | undefined;
		activeId?: string;
		isFloating?: boolean;
		[key: string]: any;
	}

	let { content = $bindable(), activeId = '', isFloating = false, ...rest }: Props = $props();
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
	data-testid="toc"
	class={isFloating
		? 'fixed top-1/3 right-4 z-50 cursor-pointer select-none ' +
			(isHovered
				? 'rounded-box border-base-content/10 bg-base-100/95 max-h-[60vh] max-w-[80vw] overflow-y-auto border p-4 shadow-xl backdrop-blur-xs'
				: 'border-transparent bg-transparent p-2 shadow-none')
		: ''}
	onmouseenter={() => {
		if (isFloating) isHovered = true;
	}}
	onmouseleave={() => {
		if (isFloating) isHovered = false;
	}}
	onclick={(e) => {
		if (isFloating) {
			const target = e.target as HTMLElement;
			if (target.closest('a')) return;
			isHovered = !isHovered;
		}
	}}
	{...rest}
>
	<div>
		{#each rootHeadings as root (root.data.textContent)}
			<TocTree tree={root} {activeId} {isFloating} {isHovered} />
		{/each}
	</div>
</div>
