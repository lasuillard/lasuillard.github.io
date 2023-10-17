<script lang="ts">
	import type { TreeNode } from '$lib/toc';

	export let tree: TreeNode<HTMLElement>;
</script>

<div data-testid="toc-tree" {...$$restProps}>
	<p class="mb-1 font-semibold">{tree.data.textContent}</p>
	<ul>
		{#each tree.children as child}
			<li class="ml-4">
				<svelte:self tree={child} />
			</li>
		{/each}
	</ul>
</div>
