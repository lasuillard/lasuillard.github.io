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
	class="border-base-300 bg-base-100 my-8 rounded-xs border p-6 shadow-sm"
	data-testid="series-widget"
>
	<h3 class="text-base-content mb-4 flex items-center gap-2 text-lg font-bold">
		<span>📁</span> <span>{seriesName}</span>
	</h3>
	<ul class="space-y-3">
		{#each sortedPosts as post (post.metadata.id)}
			<li class="flex items-center justify-between text-sm">
				{#if post.metadata.id === currentPostId}
					<div class="text-base-content flex items-center gap-2 font-semibold">
						<span>👉</span>
						<span class="underline underline-offset-4">{post.metadata.title}</span>
						<span class="badge badge-outline badge-xs ml-1 rounded-xs">Current</span>
					</div>
				{:else}
					<a
						href="/blog/{post.metadata.id}-{post.metadata.slug}"
						class="link link-hover text-base-content hover:text-secondary transition-colors"
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
