<script lang="ts">
	import Markdown from '$components/content/Markdown.svelte';
	import Search from '$components/utility/Search.svelte';
	import { formatDistance } from 'date-fns';

	let { data } = $props();

	const { allPosts } = data;
	const allTags = new Set(allPosts.map((post) => post.metadata.tags).flat());
</script>

<div>
	<div class="grid grid-cols-1 xl:grid-cols-4">
		<div class="mb-32">
			<Search />

			<!-- All tags -->
			<div data-testid="tags">
				<h2 class="mt-10 mb-2 text-2xl uppercase">Tags</h2>
				<div>
					{#if allTags.size}
						{#each allTags as tag (tag)}
							<span
								class="badge badge-secondary badge-sm md:badge-md mr-2 mb-2 rounded-xs font-semibold"
							>
								<a href="/blog/tag/{tag}">
									{tag}
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
				{#if allPosts.length}
					{#each allPosts as { slug, metadata: { title, publicationDate, preview, summary, tags } } (slug)}
						<div>
							<div class="flex flex-col lg:flex-row">
								<img
									src={preview}
									alt="Preview"
									class="h-92 w-full rounded-xs object-contain lg:h-64 lg:w-96"
								/>
								<div class="mt-4 flex flex-1 flex-col lg:mt-2 lg:ml-16">
									<h2 class="mb-0 text-3xl">
										<a href="/blog/{slug}" class="link hover:text-secondary">{title}</a>
									</h2>
									<p class="text-gray-500">
										<time datetime={publicationDate.toISOString()} role="time"
											>{formatDistance(publicationDate, new Date(), { addSuffix: true })}</time
										>
									</p>
									<div class="mt-4">
										<Markdown>{summary}</Markdown>
									</div>
									<div class="mt-6 mb-2">
										{#each tags as tag (tag)}
											<span
												class="badge badge-secondary badge-sm md:badge-md mr-2 rounded-xs font-semibold"
											>
												<a href="/blog/tag/{tag}">{tag}</a>
											</span>
										{/each}
									</div>
								</div>
							</div>
						</div>
					{/each}
				{:else}
					<p class="text-lg">There is no post yet.</p>
				{/if}
			</div>
		</section>

		<!-- TODO: Pagination -->
	</div>
</div>
