<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import PostCard from '$components/content/PostCard.svelte';
	import Pagination from './Pagination.svelte';

	import { PAGE_SIZE } from '$lib/constants';
	import { route } from '$lib/urls';
	import { fade, fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	let { data } = $props();

	let allPosts = $derived(data.allPosts);

	let tagCounts = $derived.by(() => {
		const counts: Record<string, number> = Object.create(null);
		for (const post of allPosts) {
			for (const tag of post.metadata.tags) {
				counts[tag] = (counts[tag] || 0) + 1;
			}
		}
		return counts;
	});

	let allTags = $derived(Object.keys(tagCounts).sort((a, b) => a.localeCompare(b)));

	let selectedTag = $derived($page.url.searchParams.get('tag'));

	let filteredPosts = $derived(
		selectedTag
			? allPosts.filter((post) =>
					post.metadata.tags.map((t) => t.toLowerCase()).includes(selectedTag!.toLowerCase())
				)
			: allPosts
	);

	let totalPages = $derived(Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE)));

	let rawPage = $derived.by(() => {
		const pageParam = $page.url.searchParams.get('page');
		if (pageParam) {
			const parsed = parseInt(pageParam, 10);
			if (!isNaN(parsed) && parsed > 0) return parsed;
		}
		return 1;
	});

	let currentPage = $derived(Math.min(rawPage, totalPages));

	let paginatedPosts = $derived(
		filteredPosts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
	);

	$effect(() => {
		if (rawPage > totalPages) {
			goto(
				route('/blog', {
					query: { tag: selectedTag ?? undefined, page: totalPages === 1 ? undefined : totalPages }
				}),
				{
					replaceState: true
				}
			);
		}
	});

	let tagsDropdownOpen = $state(false);

	$effect(() => {
		// Close the tags dropdown whenever the selected tag changes
		if (selectedTag || !selectedTag) {
			tagsDropdownOpen = false;
		}
	});
</script>

{#snippet tagsList()}
	<ul class="menu bg-base-100/50 w-full rounded-2xl p-0">
		{#if allTags.length}
			<li>
				<a
					href="/blog"
					class:active={!selectedTag}
					class="flex justify-between py-2.5 text-base font-medium"
				>
					<span>전체보기</span>
					<span class="badge badge-sm badge-ghost">{allPosts.length}</span>
				</a>
			</li>
			<li class="border-base-200 my-2 border-b"></li>
			{#each allTags as tag (tag)}
				{@const isSelected = selectedTag?.toLowerCase() === tag.toLowerCase()}
				<li>
					<a
						href="?tag={tag}"
						class:active={isSelected}
						class="flex justify-between py-2.5 text-base font-medium transition-colors"
					>
						<span>{tag}</span>
						<span class="badge badge-sm badge-ghost">{tagCounts[tag]}</span>
					</a>
				</li>
			{/each}
		{:else}
			<p class="text-base-content/70 p-4 text-sm">아직 태그가 없습니다.</p>
		{/if}
	</ul>
{/snippet}

<div class="pt-4 pb-12 xl:pt-8">
	<div class="grid grid-cols-1 items-start gap-8 lg:gap-16 xl:grid-cols-4">
		<aside class="order-1 w-full xl:sticky xl:top-28 xl:order-1 xl:col-span-1">
			<!-- Mobile/Tablet Collapsible Tags -->
			<details
				class="collapse-arrow bg-base-100 border-base-200 collapse rounded-2xl border shadow-sm xl:hidden"
				bind:open={tagsDropdownOpen}
			>
				<summary class="collapse-title text-lg font-bold">
					{#if selectedTag}
						<span class="text-primary">"{selectedTag}"</span> ({filteredPosts.length})
					{:else}
						전체보기 ({allPosts.length})
					{/if}
				</summary>
				<div class="collapse-content px-2 pb-2">
					{@render tagsList()}
				</div>
			</details>

			<!-- Desktop Sidebar Tags -->
			<div
				class="hidden max-h-[calc(100vh-8rem)] overflow-y-auto overscroll-contain pr-2 pb-8 xl:block"
				data-testid="tags"
			>
				<h2
					class="text-base-content bg-base-100/90 sticky top-0 z-10 mb-6 py-2 text-sm font-bold tracking-widest uppercase backdrop-blur-sm"
				>
					태그 분류
				</h2>
				{@render tagsList()}
			</div>
		</aside>

		<!-- Posts -->
		<section data-testid="posts" class="order-2 w-full xl:order-2 xl:col-span-3">
			<!-- Top Pagination -->
			<div class="mb-10 flex justify-center xl:justify-end">
				<Pagination {currentPage} {totalPages} />
			</div>

			<div
				class="grid grid-cols-1 items-start gap-x-5 gap-y-8 md:grid-cols-2 lg:gap-x-6 lg:gap-y-10"
			>
				{#if paginatedPosts.length}
					{#each paginatedPosts as { metadata } (metadata.id)}
						<div
							class="w-full"
							in:fly={{ y: 20, duration: 400, delay: 150 }}
							out:fade={{ duration: 150 }}
							animate:flip={{ duration: 400 }}
						>
							<PostCard {metadata} {selectedTag} variant="vertical" />
						</div>
					{/each}
				{:else if selectedTag}
					<div class="text-base-content/70 col-span-full py-20 text-center text-lg">
						"{selectedTag}"에 관한 글이 없습니다.
					</div>
				{:else}
					<div class="text-base-content/70 col-span-full py-20 text-center text-lg">
						아직 쓴 글이 없습니다.
					</div>
				{/if}
			</div>

			<!-- Bottom Pagination -->
			<div class="mt-20 flex justify-center">
				<Pagination {currentPage} {totalPages} />
			</div>
		</section>
	</div>
</div>
