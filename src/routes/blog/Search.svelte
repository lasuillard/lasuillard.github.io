<script lang="ts">
	import { untrack } from 'svelte';
	import SearchIcon from '$components/icon/Search.svelte';
	import XMarkIcon from '$components/icon/XMark.svelte';
	import { getEngine } from '$lib/search';
	import { quoteJoin } from '$lib/utils';
	import { route } from '$lib/urls';
	import { goto } from '$app/navigation';
	import type { SearchResult, Suggestion } from 'minisearch';

	const searchEngine = getEngine();

	let isModalOpen = $state(false);
	let query = $state('');
	let searchResults: SearchResult[] = $state([]);
	let suggestions: Suggestion[] = $state([]);
	let activeIndex = $state(-1);
	let modalInput: HTMLInputElement | undefined = $state();

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

	function openModal() {
		isModalOpen = true;
		activeIndex = -1;
	}

	function closeModal() {
		isModalOpen = false;
		query = '';
		activeIndex = -1;
	}

	function handleGlobalKeydown(e: KeyboardEvent) {
		const isTyping = ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName);
		if (isTyping) {
			if (e.key === 'Escape' && isModalOpen) {
				closeModal();
				e.preventDefault();
			}
			return;
		}

		if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || e.key === '/') {
			e.preventDefault();
			openModal();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			closeModal();
			e.preventDefault();
			return;
		}

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
			closeModal();
			goto(
				route('/blog/[slug]', {
					params: { slug: `${result.id}-${result.slug || result['metadata.slug']}` }
				})
			);
		}
	}

	// Svelte action to teleport the modal elements to document.body
	function portal(node: HTMLElement) {
		document.body.appendChild(node);
		return {
			destroy() {
				if (node.parentNode) {
					node.parentNode.removeChild(node);
				}
			}
		};
	}

	// Auto-focus input when modal opens
	$effect(() => {
		if (isModalOpen && modalInput) {
			untrack(() => {
				modalInput?.focus();
			});
		}
	});

	// Reactive search engine query handler
	$effect(() => {
		const value = query;
		if (!value) {
			untrack(() => {
				searchResults = [];
				activeIndex = -1;
			});
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
		const slicedResults = results.slice(0, 5);

		untrack(() => {
			searchResults = slicedResults;
			activeIndex = -1;

			console.debug(
				`Searching for "${value}": ${quoteJoin(slicedResults.map((result) => result.id))}`
			);

			if (!slicedResults.length) {
				suggestions = searchEngine.autoSuggest(value, { fuzzy: 0.25 });
				console.debug(
					`No search result, making suggestion: ${quoteJoin(
						suggestions.map((value) => value.suggestion)
					)}`
					);
			}
		});
	});
</script>

<svelte:window onkeydown={handleGlobalKeydown} />

<div data-testid="search" class="mb-2 w-full">
	<button
		onclick={openModal}
		class="input input-bordered flex h-10 w-full items-center gap-2 text-left text-base-content/40 font-light"
		aria-label="검색"
	>
		<SearchIcon class="h-4 w-4 stroke-gray-400" />
		<span>검색...</span>
		<kbd class="kbd kbd-xs ml-auto">Ctrl + K</kbd>
	</button>

	{#if isModalOpen}
		<div
			use:portal
			class="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-xs flex justify-center items-start pt-[15vh] p-4"
			onclick={(e) => {
				if (e.target === e.currentTarget) {
					closeModal();
				}
			}}
			onkeydown={(e) => {
				if (e.key === 'Escape') {
					closeModal();
				}
			}}
			tabindex="-1"
			role="dialog"
			aria-modal="true"
			data-testid="search-modal"
		>
			<div
				class="bg-base-200 w-full max-w-2xl rounded-lg shadow-2xl flex flex-col overflow-hidden border border-base-300"
			>
				<!-- Search bar -->
				<div class="p-4 border-b border-base-300 flex items-center gap-3">
					<SearchIcon class="h-5 w-5 stroke-gray-400 flex-shrink-0" />
					<input
						bind:this={modalInput}
						type="text"
						placeholder="검색어를 입력하세요..."
						bind:value={query}
						onkeydown={handleKeydown}
						class="grow bg-transparent outline-none text-base text-base-content placeholder:font-light"
					/>
					<kbd class="kbd kbd-xs">ESC</kbd>
					<button
						type="button"
						aria-label="Close"
						class="btn btn-ghost btn-circle btn-xs"
						onclick={closeModal}
					>
						<XMarkIcon class="h-5 w-5" />
					</button>
				</div>

				<!-- Results/Suggestions -->
				<div class="max-h-[60vh] overflow-y-auto p-2" role="searchbox">
					{#if query}
						{#if processedResults.length > 0}
							<ol class="menu w-full p-0 gap-1">
								{#each processedResults as result, i (result.id)}
									<li
										class="{i === activeIndex ? 'bg-base-300' : ''} rounded-md overflow-hidden"
									>
										<a
											href="/blog/{result.id}-{result.slug}"
											onclick={closeModal}
											class="flex flex-col items-start gap-1 p-3 font-normal"
										>
											<span class="text-sm font-bold text-base-content block w-full text-left truncate">
												{result.title}
											</span>
											{#if result.snippetFragments && result.snippetFragments.length > 0}
												<p
													class="text-xs text-base-content/70 line-clamp-2 text-left w-full leading-relaxed font-normal"
												>
													{#each result.snippetFragments as fragment, idx (idx)}
														{#if fragment.isMatch}
															<mark
																class="bg-primary/20 text-primary dark:text-primary-content font-semibold rounded-xs px-0.5"
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
						{:else}
							<div class="flex flex-col items-center justify-center py-10 px-4 text-center">
								<h2 class="text-lg font-semibold text-base-content/70">검색 결과가 없습니다.</h2>
								<p class="text-sm text-base-content/50 mt-1">추천 검색어:</p>
								{#if suggestions.length > 0}
									<button
										class="btn btn-ghost btn-sm mt-2 text-primary font-normal"
										onclick={() => {
											query = suggestions[0].suggestion;
										}}
									>
										{suggestions[0].suggestion}
									</button>
								{:else}
									<p class="text-sm text-base-content/40 mt-1">...</p>
								{/if}
							</div>
						{/if}
					{:else}
						<div class="flex flex-col items-center justify-center py-12 text-base-content/40">
							<SearchIcon class="h-10 w-10 stroke-base-content/30 mb-2" />
							<p class="text-sm font-light">검색어를 입력하여 게시글을 찾아보세요.</p>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>
