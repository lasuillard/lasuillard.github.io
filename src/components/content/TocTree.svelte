<script lang="ts">
	import type { TreeNode } from '$lib/toc';
	import TocTree from './TocTree.svelte';

	interface Props {
		tree: TreeNode<HTMLElement>;
		[key: string]: any;
	}

	let { tree, ...rest }: Props = $props();

	const heading = tree.data.textContent;

	// Link possibly generated by rehype-slug
	const link = tree.data.querySelector('a')?.getAttribute('href');
</script>

<div data-testid="toc-tree" {...rest}>
	<p class="mb-1.5 font-light">
		<a class="link-hover link" href={link}>{heading}</a>
	</p>
	<ul>
		{#each tree.children as child (child.data.textContent)}
			<li class="ml-8">
				<TocTree tree={child} />
			</li>
		{/each}
	</ul>
</div>
