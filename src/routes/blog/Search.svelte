<script lang="ts">
	import SearchIcon from '$components/icon/Search.svelte';
	import XMarkIcon from '$components/icon/XMark.svelte';
	import { getEngine } from '$lib/search';
	import { quoteJoin } from '$lib/utils';
	import { route } from '$lib/urls';
	import { goto } from '$app/navigation';
	import type { SearchResult, Suggestion } from 'minisearch';
	import { writable } from 'svelte/store';

	const searchEngine = getEngine();

	let searchInput: HTMLInputElement;
	let searchText = writable('');
	let searchResults: SearchResult[] = $state([]);
	let suggestions: Suggestion[] = $state([]);

	let isFocused = $state(false);
	let activeIndex = $state(-1);

	function getSnippetFragments(
		content: string,
		terms: string[],
		snippetLength = 150
	): { text: string; isMatch: boolean }[] {
		if (!content) return [];

		// Find the first matching term in content
		let bestMatchIndex = -1;
		let matchedTerm = '';

		const lowerContent = content.toLowerCase();
		for (const term of terms) {
			const index = lowerContent.indexOf(term.toLowerCase());
			if (index !== -1 && (bestMatchIndex === -1 || index < bestMatchIndex)) {
				bestMatchIndex = index;
				matchedTerm = term;
			}
		}

		let text: string;
		let start: number;
		let end: number;

		if (bestMatchIndex === -1) {
			// Fallback to beginning of content
			text = content.slice(0, snippetLength);
			if (content.length > snippetLength) {
				text += '...';
			}
		} else {
			const matchLength = matchedTerm.length;
			const idealBefore = Math.floor((snippetLength - matchLength) / 2);

			start = Math.max(0, bestMatchIndex - idealBefore);
			end = Math.min(content.length, start + snippetLength);

			if (end === content.length) {
				start = Math.max(0, end - snippetLength);
			}

			text = content.slice(start, end);
			if (start > 0) {
				text = '...' + text;
			}
			if (end < content.length) {
				text = text + '...';
			}
		}

		// Now split text into fragments based on terms
		const sortedTerms = [...terms]
			.filter((t) => t.trim() !== '')
			.sort((a, b) => b.length - a.length);

		if (sortedTerms.length === 0) {
			return [{ text, isMatch: false }];
		}

		const escapedTerms = sortedTerms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
		const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');

		const parts = text.split(regex);
		const termSet = new Set(terms.map((t) => t.toLowerCase()));

		return parts
			.map((part) => ({
				text: part,
				isMatch: termSet.has(part.toLowerCase())
			}))
			.filter((part) => part.text !== '');
	}

	let processedResults = $derived(
		searchResults.map((result) => {
			const terms = result.terms || [];
			const content = (result as any).content || '';
			const snippetFragments = getSnippetFragments(content, terms, 150);
			const res = result as any;
			return {
				id: res.id,
				slug: res['metadata.slug'],
				title: res['metadata.title'],
				snippetFragments
			};
		})
	);

	function clearSearch() {
		$searchText = '';
		if (searchInput) {
			searchInput.focus();
		}
	}

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

		const results = searchEngine.search(value, {
			fuzzy: (term) => (term.length > 3 ? 0.1 : false)
		});
		results.sort(
			// FIXME: Get results type annotated
			(a, b) =>
				b['metadata.publicationDate'] - a['metadata.publicationDate'] ||
				a['metadata.title'].localeCompare(b['metadata.title'])
		);
		searchResults = results.slice(0, 5);

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
			<!-- TODO: Auto-fill suggestion (tab key?) -->
			<label class="input input-bordered flex h-10 items-center gap-2">
				<SearchIcon class="h-4 w-4 stroke-gray-400" />
				<input
					bind:this={searchInput}
					type="text"
					placeholder="..."
					bind:value={$searchText}
					onkeydown={handleKeydown}
					class="grow placeholder:font-light"
				/>
				<button
					type="button"
					aria-label="Clear search"
					class="btn btn-ghost btn-circle btn-xs"
					onclick={clearSearch}
				>
					<XMarkIcon class="h-4 w-4" />
				</button>
			</label>
			<div
				class="dropdown absolute top-[135%] right-0 z-1 w-[20rem] max-w-[90vw] sm:w-[26rem] md:w-[32rem] {$searchText.length >
					0 && isFocused
					? 'dropdown-open'
					: ''}"
			>
				{#if $searchText}
					<div role="searchbox">
						<ol
							class="menu dropdown-content bg-base-200 w-full space-y-2 rounded-xs shadow-xl hover:visible!"
						>
							{#each processedResults as result, i (result.id)}
								<li class={i === activeIndex ? 'bg-base-300' : ''}>
									<a
										href="/blog/{result.id}-{result.slug}"
										class="flex flex-col items-start gap-1 p-3 font-normal"
									>
										<span
											class="text-base-content block w-full truncate text-left text-sm font-bold"
										>
											{result.title}
										</span>
										{#if result.snippetFragments && result.snippetFragments.length > 0}
											<p
												class="text-base-content/70 line-clamp-2 w-full text-left text-xs leading-relaxed font-normal"
											>
												{#each result.snippetFragments as fragment, idx (idx)}
													{#if fragment.isMatch}
														<mark
															class="bg-primary/20 text-primary dark:text-primary-content rounded-xs px-0.5 font-semibold"
															>{fragment.text}</mark
														>
													{:else}
														{fragment.text}
													{/if}
												{/each}
											</p>
										{/if}
									</a>
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
