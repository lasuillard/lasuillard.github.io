<script lang="ts">
	import TocTree from '$components/content/TocTree.svelte';
	import { makeToc, type TreeNode, type TreeSource } from '$lib/toc';
	import { onMount } from 'svelte';

	interface Props {
		content: HTMLElement | undefined;
		[key: string]: any;
	}

	let { content = $bindable(), ...rest }: Props = $props();
	let rootHeadings: TreeNode<HTMLElement>[] = $state([]);

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

<div data-testid="toc" {...rest}>
	<div>
		{#each rootHeadings as root (root.data.textContent)}
			<TocTree tree={root} />
		{/each}
	</div>
</div>
