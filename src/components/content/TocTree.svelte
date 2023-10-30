<script lang="ts">
	import type { TreeNode } from '$lib/toc';

	export let tree: TreeNode<HTMLElement>;

	const heading = tree.data.textContent;
	const link = tree.data.querySelector('a')?.getAttribute('href');
</script>

<div data-testid="toc-tree" {...$$restProps}>
	<p class="mb-1 font-light">
		<a class="link-hover link" href={link}>{heading}</a>
	</p>
	<ul>
		{#each tree.children as child}
			<li class="ml-4">
				<svelte:self tree={child} />
			</li>
		{/each}
	</ul>
</div>
