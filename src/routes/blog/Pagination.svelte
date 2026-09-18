<script lang="ts">
	import { page } from '$app/stores';
	import { route } from '$lib/urls';
	import ChevronLeftIcon from '$components/icon/ChevronLeft.svelte';
	import ChevronRightIcon from '$components/icon/ChevronRight.svelte';

	interface Props {
		currentPage: number;
		totalPages: number;
	}

	let { currentPage, totalPages }: Props = $props();

	let tag = $derived($page.url.searchParams.get('tag'));

	function getPageUrl(pageNum: number | string) {
		const page = Number(pageNum);
		return route('/blog', {
			query: {
				tag: tag ?? undefined,
				page: page === 1 ? undefined : page
			}
		});
	}

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
</script>

<div class="flex items-center justify-center gap-2 sm:gap-4" data-testid="pagination">
	<!-- Previous page -->
	{#if currentPage === 1}
		<button
			class="btn btn-ghost btn-sm sm:btn-md btn-circle cursor-not-allowed opacity-50"
			aria-label="이전 페이지"
			disabled
		>
			<ChevronLeftIcon class="h-5 w-5" />
		</button>
	{:else}
		<a
			class="btn btn-ghost btn-sm sm:btn-md btn-circle text-base-content/70 hover:text-base-content hover:bg-base-200"
			href={getPageUrl(currentPage - 1)}
			aria-label="이전 페이지"
		>
			<ChevronLeftIcon class="h-5 w-5" />
		</a>
	{/if}

	<!-- Page numbers and Ellipsis -->
	<div class="flex items-center gap-1">
		{#each visiblePages as item, i (item + '-' + i)}
			{#if item === '...'}
				<span
					class="text-base-content/50 px-2 font-bold tracking-widest select-none"
					aria-label="생략"
				>
					...
				</span>
			{:else}
				<a
					class="btn btn-sm sm:btn-md w-9 rounded-xl text-sm font-semibold transition-all sm:w-11 sm:text-base
						{currentPage === item
						? 'btn-primary text-primary-content scale-105 shadow-md'
						: 'btn-ghost text-base-content/70 hover:bg-base-200 hover:text-base-content'}"
					href={getPageUrl(item)}
				>
					{item}
				</a>
			{/if}
		{/each}
	</div>

	<!-- Next page -->
	{#if currentPage === totalPages}
		<button
			class="btn btn-ghost btn-sm sm:btn-md btn-circle cursor-not-allowed opacity-50"
			aria-label="다음 페이지"
			disabled
		>
			<ChevronRightIcon class="h-5 w-5" />
		</button>
	{:else}
		<a
			class="btn btn-ghost btn-sm sm:btn-md btn-circle text-base-content/70 hover:text-base-content hover:bg-base-200"
			href={getPageUrl(currentPage + 1)}
			aria-label="다음 페이지"
		>
			<ChevronRightIcon class="h-5 w-5" />
		</a>
	{/if}
</div>
