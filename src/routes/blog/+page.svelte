<script lang="ts">
	import { page } from '$app/stores';
	import Markdown from '$components/content/Markdown.svelte';
	import Search from '$components/utility/Search.svelte';
	import { format, formatDistanceStrict } from 'date-fns';

	let { data } = $props();

	let allPosts = $derived(data.allPosts);
	let allTags = $derived(
		[...new Set(allPosts.map((post) => post.metadata.tags).flat())].sort((a, b) =>
			a.localeCompare(b)
		)
	);

	let tagCounts = $derived.by(() => {
		const counts: Record<string, number> = Object.create(null);
		for (const post of allPosts) {
			for (const tag of post.metadata.tags) {
				counts[tag] = (counts[tag] || 0) + 1;
			}
		}
		return counts;
	});

	let selectedTag = $derived($page.url.searchParams.get('tag'));
	let filteredPosts = $derived(
		selectedTag
			? allPosts.filter((post) =>
					post.metadata.tags.map((t) => t.toLowerCase()).includes(selectedTag.toLowerCase())
				)
			: allPosts
	);
</script>

<div>
	<div class="grid grid-cols-1 xl:grid-cols-4">
		<div class="mb-32">
			<Search />

			<!-- All tags -->
			<div data-testid="tags">
				<h2 class="mt-10 mb-2 text-2xl uppercase">Tags</h2>
				<div>
					{#if allTags.length}
						{#each allTags as tag (tag)}
							{@const isSelected = selectedTag?.toLowerCase() === tag.toLowerCase()}
							<span
								class="badge {isSelected
									? 'badge-primary'
									: 'badge-secondary'} badge-sm md:badge-md mr-2 mb-2 rounded-xs font-semibold"
							>
								<a href={isSelected ? '/blog' : `/blog?tag=${encodeURIComponent(tag)}`}>
									{tag} ({tagCounts[tag] || 0}){isSelected ? ' ×' : ''}
								</a>
							</span>
						{/each}
					{:else}
						<p class="text-lg">There is no tag yet.</p>
					{/if}
				</div>
			</div>
		</div>

		<!-- Posts -->
		<section data-testid="posts" class="xl:col-span-3">
			<div class="flex flex-col space-y-32">
				{#if filteredPosts.length}
					{#each filteredPosts as { metadata: { id, slug, title, publicationDate, preview, summary, tags } } (id)}
						<div>
							<div class="flex flex-col lg:flex-row">
								<img
									src={preview}
									alt="Preview"
									class="h-92 w-full rounded-xs object-contain lg:h-64 lg:w-96"
								/>
								<div class="mt-4 flex flex-1 flex-col lg:mt-2 lg:ml-16">
									<h2 class="mb-0 text-center text-2xl lg:text-left">
										<a href="/blog/{id}-{slug}" class="link hover:text-secondary">{title}</a>
									</h2>
									<p class="mt-1 text-end text-gray-500 lg:text-left">
										<time datetime={publicationDate.toISOString()} role="time">
											{formatDistanceStrict(publicationDate, new Date(), { addSuffix: true })}
											({format(publicationDate, 'yyyy년 M월 d일')})
										</time>
									</p>
									<div class="mt-4">
										<Markdown>{summary}</Markdown>
									</div>
									<div class="mt-6">
										{#each tags as tag (tag)}
											{@const isSelected = selectedTag?.toLowerCase() === tag.toLowerCase()}
											<span
												class="badge {isSelected
													? 'badge-primary'
													: 'badge-secondary'} badge-sm md:badge-md mr-2 mb-2 rounded-xs font-semibold"
											>
												<a href={isSelected ? '/blog' : `/blog?tag=${encodeURIComponent(tag)}`}>
													{tag} ({tagCounts[tag] || 0}){isSelected ? ' ×' : ''}
												</a>
											</span>
										{/each}
									</div>
								</div>
							</div>
						</div>
					{/each}
				{:else if selectedTag}
					<p class="text-lg">There is no post with tag "{selectedTag}".</p>
				{:else}
					<p class="text-lg">There is no post yet.</p>
				{/if}
			</div>
		</section>

		<!-- TODO: Pagination -->
	</div>
</div>
