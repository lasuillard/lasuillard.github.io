<script lang="ts">
	import Search from '$components/icon/Search.svelte';
	import { getEngine } from '$lib/search';
	import { quoteJoin } from '$lib/utils';
	import type { SearchResult, Suggestion } from 'minisearch';
	import { createBubbler, preventDefault } from 'svelte/legacy';
	import { writable } from 'svelte/store';

	const bubble = createBubbler();
	const searchEngine = getEngine();

	let searchText = writable('');
	let searchResults: SearchResult[] = $state([]);
	let suggestions: Suggestion[] = $state([]);

	searchText.subscribe((text) => {
		if (!text) {
			searchResults = [];
			return;
		}

		if (!searchEngine) {
			console.debug('Trying to use search engine not initalized');
			return;
		}

		searchResults = searchEngine.search(text, { fuzzy: 0.15 });
		searchResults.sort(
			// FIXME: Get results type annotated
			(a, b) =>
				b['metadata.publicationDate'] - a['metadata.publicationDate'] ||
				a['metadata.title'].localeCompare(b['metadata.title'])
		);
		console.debug(
			`Searching for "${text}": ${quoteJoin(searchResults.map((result) => result.id))}`
		);

		if (!searchResults.length) {
			suggestions = searchEngine.autoSuggest(text, { fuzzy: 0.25 });
			console.debug(
				`No search result, making suggestion: ${quoteJoin(
					suggestions.map((value) => value.suggestion)
				)}`
			);
		}
	});
</script>

<div data-testid="search" class="mb-2 w-64">
	<div class="group relative flex items-center space-x-2">
		<form
			class="w-full"
			autocomplete="off"
			onsubmit={preventDefault(bubble('submit'))}
			role="search"
		>
			<div class="absolute mt-[9px] ml-[11px]">
				<Search class="h-4 w-4 stroke-gray-400" />
			</div>
			<!-- TODO: Add button to clear search text -->
			<!-- TODO: Auto-fill suggestion (tab key?) -->
			<input
				type="text"
				placeholder="Search"
				bind:value={$searchText}
				class="peer input input-bordered h-8 w-full pl-8 placeholder:font-light"
			/>
			<div class="dropdown peer-[:focus]:dropdown-open absolute top-[135%] right-0 z-1 w-full">
				{#if searchResults.length > 0}
					<div role="searchbox" tabindex="0">
						<ol
							class="menu dropdown-content bg-base-200 w-full space-y-2 rounded-xs shadow-xl hover:visible!"
						>
							{#each searchResults as result (result.id)}
								<li class="font-bold">
									<a href="/blog/{result.id}">{result['metadata.title']}</a>
								</li>
							{/each}
						</ol>
					</div>
				{:else}
					<div
						class="card dropdown-content compact bg-base-200 z-1 w-full rounded-xs shadow-xl"
						role="searchbox"
					>
						<div class="card-body items-center">
							<h2 class="card-title">No results found</h2>
							<p>Suggestions:</p>
							{#if suggestions.length}
								<p>{suggestions[0].suggestion || ''}</p>
							{:else}
								<p>...</p>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		</form>
	</div>
</div>
