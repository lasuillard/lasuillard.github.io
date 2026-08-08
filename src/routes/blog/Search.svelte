<script lang="ts">
	import SearchIcon from '$components/icon/Search.svelte';
	import { getEngine } from '$lib/search';
	import { quoteJoin } from '$lib/utils';
	import { route } from '$lib/urls';
	import { goto } from '$app/navigation';
	import type { SearchResult, Suggestion } from 'minisearch';
	import { writable } from 'svelte/store';

	const searchEngine = getEngine();

	let searchText = writable('');
	let searchResults: SearchResult[] = $state([]);
	let suggestions: Suggestion[] = $state([]);

	let isFocused = $state(false);
	let activeIndex = $state(-1);

	// Reset active index when results change
	$effect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		searchResults; // track
		activeIndex = -1;
	});

	function handleFocusIn() {
		isFocused = true;
	}

	function handleFocusOut(e: FocusEvent) {
		const container = e.currentTarget as HTMLElement;
		if (!container.contains(e.relatedTarget as Node)) {
			isFocused = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!searchResults.length) return;
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			activeIndex = Math.min(activeIndex + 1, searchResults.length - 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			activeIndex = Math.max(activeIndex - 1, 0);
		} else if (e.key === 'Enter' && activeIndex >= 0) {
			e.preventDefault();
			const result = searchResults[activeIndex];
			goto(route('/blog/[slug]', { params: { slug: `${result.id}-${result['metadata.slug']}` } }));
		} else if (e.key === 'Escape') {
			isFocused = false;
		}
	}

	searchText.subscribe((value) => {
		if (!value) {
			searchResults = [];
			return;
		}

		if (!searchEngine) {
			console.debug('Trying to use search engine not initalized');
			return;
		}

		searchResults = searchEngine.search(value, { fuzzy: 0.15 });
		searchResults.sort(
			// FIXME: Get results type annotated
			(a, b) =>
				b['metadata.publicationDate'] - a['metadata.publicationDate'] ||
				a['metadata.title'].localeCompare(b['metadata.title'])
		);
		console.debug(
			`Searching for "${value}": ${quoteJoin(searchResults.map((result) => result.id))}`
		);

		if (!searchResults.length) {
			suggestions = searchEngine.autoSuggest(value, { fuzzy: 0.25 });
			console.debug(
				`No search result, making suggestion: ${quoteJoin(
					suggestions.map((value) => value.suggestion)
				)}`
			);
		}
	});
</script>

<div data-testid="search" class="mb-2 w-64">
	<div
		class="group relative flex items-center space-x-2"
		onfocusin={handleFocusIn}
		onfocusout={handleFocusOut}
	>
		<div class="w-full" role="search">
			<!-- TODO: Add button to clear search text -->
			<!-- TODO: Auto-fill suggestion (tab key?) -->
			<label class="input input-bordered flex h-10 items-center gap-2">
				<SearchIcon class="h-4 w-4 stroke-gray-400" />
				<input
					type="text"
					placeholder="..."
					bind:value={$searchText}
					onkeydown={handleKeydown}
					class="grow placeholder:font-light"
				/>
			</label>
			<div
				class="dropdown absolute top-[135%] right-0 z-1 w-full {$searchText.length > 0 && isFocused
					? 'dropdown-open'
					: ''}"
			>
				{#if $searchText}
					<div role="searchbox">
						<ol
							class="menu dropdown-content bg-base-200 w-full space-y-2 rounded-xs shadow-xl hover:visible!"
						>
							{#each searchResults as result, i (result.id)}
								<li class="font-bold {i === activeIndex ? 'bg-base-300' : ''}">
									<a href="/blog/{result.id}-{result['metadata.slug']}"
										>{result['metadata.title']}</a
									>
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
		</div>
	</div>
</div>
