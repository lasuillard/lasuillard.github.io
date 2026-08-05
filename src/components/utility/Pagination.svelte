<script lang="ts">
	import { goto } from '$app/navigation';
	import { getVisiblePages } from '$lib/utils';

	interface Props {
		currentPage: number;
		totalPages: number;
		testid?: string;
	}

	let { currentPage, totalPages, testid = 'pagination' }: Props = $props();

	let visiblePages = $derived(getVisiblePages(currentPage, totalPages));

	/**
	 * Helper to dynamically update the page parameter in the URL safely.
	 * @param pageNumber The target page number.
	 * @returns The page URL pathname and search parameters.
	 */
	function getPageUrl(pageNumber: number): string {
		if (typeof window === 'undefined') {
			return `/blog?page=${pageNumber}`;
		}
		const url = new URL(window.location.href);
		url.searchParams.set('page', pageNumber.toString());
		return url.pathname + url.search;
	}

	/** Prompt user to go to a specific page number. */
	function handleGoToPage() {
		const input = prompt(`Go to page (1-${totalPages}):`);
		if (input === null) return;
		const page = parseInt(input, 10);
		if (!isNaN(page) && page >= 1 && page <= totalPages) {
			goto(getPageUrl(page));
		} else {
			alert(`Please enter a valid page number between 1 and ${totalPages}`);
		}
	}
</script>

<div class="join" data-testid={testid} data-sveltekit-preload-data="hover">
	<!-- First page & Previous page -->
	{#if currentPage === 1}
		<span class="join-item btn btn-sm btn-disabled" aria-label="First page">&lt;&lt;</span>
		<span class="join-item btn btn-sm btn-disabled" aria-label="Previous page">&lt;</span>
	{:else}
		<a class="join-item btn btn-sm" href={getPageUrl(1)} aria-label="First page">&lt;&lt;</a>
		<a class="join-item btn btn-sm" href={getPageUrl(currentPage - 1)} aria-label="Previous page"
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
				href={getPageUrl(Number(item))}
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
		<a class="join-item btn btn-sm" href={getPageUrl(currentPage + 1)} aria-label="Next page"
			>&gt;</a
		>
		<a class="join-item btn btn-sm" href={getPageUrl(totalPages)} aria-label="Last page">&gt;&gt;</a
		>
	{/if}
</div>
