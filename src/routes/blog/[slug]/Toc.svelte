<script lang="ts">
	import TocTree from './TocTree.svelte';
	import { makeToc, type TreeNode, type TreeSource } from '$lib/toc';
	import { onMount } from 'svelte';

	interface Props {
		content: HTMLElement | undefined;
		activeId?: string;
	}

	let { content, activeId = '' }: Props = $props();
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

	function handleWindowKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && isHovered) {
			isHovered = false;
		}
	}
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<aside
	data-testid="toc"
	aria-label="목차"
	class={'fixed top-24 right-4 z-50 transition-all duration-300 select-none lg:top-32 lg:right-8 ' +
		(isHovered
			? 'border-base-200 bg-base-100/90 max-h-[calc(100vh-8rem)] w-fit max-w-[85vw] min-w-[200px] overflow-x-hidden overflow-y-auto rounded-2xl border p-6 shadow-2xl backdrop-blur-md lg:max-w-[450px]'
			: 'border-transparent bg-transparent p-2 shadow-none')}
	onmouseenter={() => {
		isHovered = true;
	}}
	onmouseleave={() => {
		isHovered = false;
	}}
>
	{#if !isHovered}
		<button
			type="button"
			class="cursor-pointer border-none bg-transparent p-0 text-left outline-none"
			aria-label="목차 열기"
			aria-expanded="false"
			onclick={() => {
				isHovered = true;
			}}
		>
			{#each rootHeadings as root (root.data.textContent)}
				<TocTree tree={root} {activeId} {isHovered} />
			{/each}
		</button>
	{:else}
		<nav aria-label="목차 링크">
			{#each rootHeadings as root (root.data.textContent)}
				<TocTree tree={root} {activeId} {isHovered} />
			{/each}
		</nav>
	{/if}
</aside>
