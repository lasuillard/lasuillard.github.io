<script lang="ts">
	import FolderIcon from '$components/icon/Folder.svelte';
	import type { Post } from '$lib/post';
	import { route } from '$lib/urls';
	import { format } from 'date-fns';

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

<details
	class="collapse-arrow bg-base-200/50 border-base-300 rounded-r-box border-l-primary collapse my-8 border border-l-4 shadow-xs"
	open
	data-testid="series-widget"
>
	<summary class="collapse-title cursor-pointer px-5 py-3.5" data-testid="series-header">
		<div class="flex items-center justify-between pr-6">
			<div class="flex items-center gap-2.5">
				<div
					class="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
				>
					<FolderIcon class="h-5 w-5 stroke-2" stroke-width="2" />
				</div>
				<h3 class="text-base-content text-base leading-none font-bold" data-testid="series-title">
					{seriesName}
				</h3>
			</div>
			<span
				class="badge badge-neutral badge-sm font-mono font-medium whitespace-nowrap"
				data-testid="series-count"
			>
				{sortedPosts.length}개의 글
			</span>
		</div>
	</summary>

	<div class="collapse-content px-5 pb-5">
		<div class="border-base-300 border-t pt-3">
			<ul class="max-h-48 space-y-3 overflow-y-auto pr-2" data-testid="series-list">
				{#each sortedPosts as post (post.metadata.id)}
					<li
						class="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-4"
						data-testid="series-item"
					>
						<div class="flex items-center gap-1.5 whitespace-nowrap sm:w-44 sm:shrink-0">
							<time
								datetime={new Date(post.metadata.publicationDate).toISOString()}
								class="badge badge-sm font-mono font-medium {post.metadata.id === currentPostId
									? 'badge-primary'
									: 'bg-base-100 border-base-300 text-base-content border'}"
								data-testid="series-item-date"
							>
								{format(new Date(post.metadata.publicationDate), 'yyyy-MM-dd')}
							</time>
							{#if post.metadata.id === currentPostId}
								<span
									class="badge badge-outline badge-sm text-primary font-bold"
									data-testid="series-current-badge"
								>
									현재
								</span>
							{/if}
						</div>
						<div class="text-sm leading-6 sm:grow" data-testid="series-item-title">
							{#if post.metadata.id === currentPostId}
								<span class="text-base-content font-semibold underline underline-offset-4">
									{post.metadata.title}
								</span>
							{:else}
								<a
									href={route('/blog/[slug]', {
										params: { slug: `${post.metadata.id}-${post.metadata.slug}` }
									})}
									class="link link-hover text-base-content font-light transition-colors"
								>
									{post.metadata.title}
								</a>
							{/if}
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</details>
