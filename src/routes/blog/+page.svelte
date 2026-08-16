<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import PostCard from '$components/content/PostCard.svelte';
	import TagBadge from '$components/content/TagBadge.svelte';
	import Pagination from './Pagination.svelte';

	import { PAGE_SIZE } from '$lib/constants';
	import { route } from '$lib/urls';
	import { fade } from 'svelte/transition';
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
</script>

<div>
	<div class="grid grid-cols-1 items-start gap-8 lg:gap-12 xl:grid-cols-4 xl:gap-16">
		<aside class="order-1 mb-8 w-full xl:sticky xl:top-24 xl:order-1 xl:col-span-1 xl:mb-0">
			<!-- All tags -->
			<div data-testid="tags">
				<h2 class="mt-10 mb-2 text-2xl uppercase">Tags</h2>
				<div class="flex flex-wrap gap-2">
					{#if allTags.length}
						{#each allTags as tag (tag)}
							{@const isSelected = selectedTag?.toLowerCase() === tag.toLowerCase()}
							<TagBadge {tag} selected={isSelected} count={tagCounts[tag] || 0} showCount />
						{/each}
					{:else}
						<p class="text-lg">There is no tag yet.</p>
					{/if}
				</div>
			</div>
		</aside>

		<!-- Posts -->
		<section data-testid="posts" class="order-2 w-full xl:order-2 xl:col-span-3">
			<!-- Top Pagination -->
			<div class="mb-20 flex justify-center">
				<Pagination {currentPage} {totalPages} />
			</div>

			<div class="flex flex-col space-y-12 lg:space-y-16">
				{#if paginatedPosts.length}
					{#each paginatedPosts as { metadata } (metadata.id)}
						<div transition:fade={{ duration: 200 }} animate:flip={{ duration: 300 }}>
							<PostCard {metadata} {selectedTag} variant="horizontal" />
						</div>
					{/each}
				{:else if selectedTag}
					<p class="text-center text-lg">"{selectedTag}"에 관한 글이 없습니다.</p>
				{:else}
					<p class="text-center text-lg">아직 쓴 글이 없습니다.</p>
				{/if}
			</div>

			<!-- Bottom Pagination -->
			<div class="mt-20 flex justify-center">
				<Pagination {currentPage} {totalPages} />
			</div>
		</section>
	</div>
</div>
