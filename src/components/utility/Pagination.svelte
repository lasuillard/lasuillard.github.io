<script lang="ts">
	import { goto } from '$app/navigation';

	interface Props {
		currentPage: number;
		totalPages: number;
	}

	let { currentPage, totalPages }: Props = $props();

	let visiblePages = $derived.by(() => {
		const pages: (number | string)[] = [];
		if (totalPages <= 7) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Always show page 1
			pages.push(1);

			if (currentPage <= 4) {
				// Near start: 1, 2, 3, 4, 5, ..., totalPages
				for (let i = 2; i <= 5; i++) {
					pages.push(i);
				}
				pages.push('...');
				pages.push(totalPages);
			} else if (currentPage >= totalPages - 3) {
				// Near end: 1, ..., totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages
				pages.push('...');
				for (let i = totalPages - 4; i <= totalPages; i++) {
					if (i > 1) {
						pages.push(i);
					}
				}
			} else {
				// Middle: 1, ..., currentPage - 1, currentPage, currentPage + 1, ..., totalPages
				pages.push('...');
				pages.push(currentPage - 1);
				pages.push(currentPage);
				pages.push(currentPage + 1);
				pages.push('...');
				pages.push(totalPages);
			}
		}
		return pages;
	});

	/** Prompt user to go to a specific page number. */
	function handleGoToPage() {
		const input = prompt(`Go to page (1-${totalPages}):`);
		if (input === null) return;
		const page = parseInt(input, 10);
		if (!isNaN(page) && page >= 1 && page <= totalPages) {
			goto(`/blog?page=${page}`);
		} else {
			alert(`Please enter a valid page number between 1 and ${totalPages}`);
		}
	}
</script>

<div class="join" data-testid="pagination">
	<!-- First page & Previous page -->
	{#if currentPage === 1}
		<span class="join-item btn btn-sm btn-disabled" aria-label="First page">&lt;&lt;</span>
		<span class="join-item btn btn-sm btn-disabled" aria-label="Previous page">&lt;</span>
	{:else}
		<a class="join-item btn btn-sm" href="/blog?page=1" aria-label="First page">&lt;&lt;</a>
		<a class="join-item btn btn-sm" href="/blog?page={currentPage - 1}" aria-label="Previous page"
			>&lt;</a
		>
	{/if}

	<!-- Page numbers and Ellipsis -->
	{#each visiblePages as item, i (item + '-' + i)}
		{#if item === '...'}
			<button
				type="button"
				class="join-item btn btn-sm"
				onclick={handleGoToPage}
				aria-label="Go to page"
			>
				...
			</button>
		{:else}
			<a
				class="join-item btn btn-sm {currentPage === item ? 'btn-active' : ''}"
				href="/blog?page={item}"
			>
				{item}
			</a>
		{/if}
	{/each}

	<!-- Next page & Last page -->
	{#if currentPage === totalPages}
		<span class="join-item btn btn-sm btn-disabled" aria-label="Next page">&gt;</span>
		<span class="join-item btn btn-sm btn-disabled" aria-label="Last page">&gt;&gt;</span>
	{:else}
		<a class="join-item btn btn-sm" href="/blog?page={currentPage + 1}" aria-label="Next page"
			>&gt;</a
		>
		<a class="join-item btn btn-sm" href="/blog?page={totalPages}" aria-label="Last page"
			>&gt;&gt;</a
		>
	{/if}
</div>
