<script lang="ts">
	import type { Post } from '$lib/post';

	let { seriesName, seriesPosts, currentPostId } = $props<{
		seriesName: string;
		seriesPosts: Post[];
		currentPostId: string;
	}>();

	const sortedPosts = $derived(
		[...seriesPosts].sort((a, b) => {
			return (
				new Date(b.metadata.publicationDate).getTime() -
				new Date(a.metadata.publicationDate).getTime()
			);
		})
	);
</script>

<div
	class="my-8 rounded-xs border border-base-300 bg-base-100 p-6 shadow-sm"
	data-testid="series-widget"
>
	<h3 class="mb-4 flex items-center gap-2 text-lg font-bold text-base-content">
		<span class="text-secondary">📁</span> Series: <span class="text-secondary">{seriesName}</span>
	</h3>
	<ul class="space-y-3">
		{#each sortedPosts as post (post.metadata.id)}
			<li class="flex items-center justify-between text-sm">
				{#if post.metadata.id === currentPostId}
					<div class="flex items-center gap-2 font-semibold text-secondary">
						<span>👉</span>
						<span class="underline underline-offset-4">{post.metadata.title}</span>
						<span class="badge badge-secondary badge-xs rounded-xs ml-1">Current</span>
					</div>
				{:else}
					<a
						href="/blog/{post.metadata.id}-{post.metadata.slug}"
						class="link link-hover text-base-content transition-colors hover:text-secondary"
					>
						{post.metadata.title}
					</a>
				{/if}
				<span class="text-xs font-light text-gray-500">
					{new Date(post.metadata.publicationDate).toLocaleDateString(undefined, {
						year: 'numeric',
						month: 'short',
						day: 'numeric'
					})}
				</span>
			</li>
		{/each}
	</ul>
</div>

<style lang="postcss">
	@reference "../../app.css";
</style>
