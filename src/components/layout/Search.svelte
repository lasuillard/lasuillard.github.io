<script lang="ts">
	import { goto } from '$app/navigation';
	import MarkdownSnippet from '$components/content/MarkdownSnippet.svelte';
	import SearchIcon from '$components/icon/Search.svelte';
	import XMarkIcon from '$components/icon/XMark.svelte';
	import { getEngine } from '$lib/search';
	import { route } from '$lib/urls';
	import { quoteJoin } from '$lib/utils';
	import type { SearchResult, Suggestion } from 'minisearch';
	import { untrack } from 'svelte';

	const searchEngine = getEngine();

	let isModalOpen = $state(false);
	let query = $state('');
	let searchResults: SearchResult[] = $state([]);
	let suggestions: Suggestion[] = $state([]);
	let activeIndex = $state(-1);
	let lastInteraction: 'mouse' | 'keyboard' = $state('keyboard');
	let modalInput: HTMLInputElement | undefined = $state();
	let resultsList: HTMLUListElement | undefined = $state();
	let modalContainer: HTMLDivElement | undefined = $state();

	let processedResults = $derived(
		searchResults.map((result) => {
			const terms = result.terms || [];
			const res = result as any;
			return {
				id: res.id,
				slug: res['metadata.slug'],
				title: res['metadata.title'],
				rawContent: res.rawContent || res.content || '',
				terms
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

	function handleModalKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			closeModal();
			e.preventDefault();
			return;
		}

		if (e.key === 'Tab' && modalContainer) {
			const focusableElements = modalContainer.querySelectorAll(
				'button:not([disabled]):not([tabindex="-1"]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
			) as NodeListOf<HTMLElement>;

			if (!focusableElements || focusableElements.length === 0) return;

			const firstElement = focusableElements[0];
			const lastElement = focusableElements[focusableElements.length - 1];

			if (e.shiftKey) {
				if (document.activeElement === firstElement) {
					lastElement.focus();
					e.preventDefault();
				}
			} else {
				if (document.activeElement === lastElement) {
					firstElement.focus();
					e.preventDefault();
				}
			}
		}
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

		if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
			e.preventDefault();
			openModal();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		lastInteraction = 'keyboard';
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

	// Scroll active item into view
	$effect(() => {
		if (lastInteraction === 'keyboard' && activeIndex >= 0 && resultsList) {
			const activeEl = resultsList.children[activeIndex] as HTMLElement;
			if (activeEl) {
				activeEl.scrollIntoView({ block: 'nearest' });
			}
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
			fuzzy: 0.2,
			combineWith: 'AND'
		});
		results.sort(
			(a: any, b: any) =>
				b['metadata.publicationDate'] - a['metadata.publicationDate'] ||
				b.score - a.score ||
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
				let rawSuggestions = searchEngine.autoSuggest(value, { fuzzy: 0.2 });
				rawSuggestions.sort((a, b) => b.score - a.score);

				const finalSuggestions: typeof rawSuggestions = [];
				for (const s of rawSuggestions) {
					// Single words only
					if (s.suggestion.trim().includes(' ')) continue;

					// Prefix-based deduplication to avoid particle spam (e.g. github, github는, github에)
					const isDuplicate = finalSuggestions.some(
						(existing) =>
							s.suggestion.startsWith(existing.suggestion) ||
							existing.suggestion.startsWith(s.suggestion)
					);

					if (!isDuplicate) {
						finalSuggestions.push(s);
					}
					if (finalSuggestions.length >= 5) break;
				}

				suggestions = finalSuggestions;
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

<div data-testid="search" class="flex items-center">
	<button
		onclick={openModal}
		class="btn btn-ghost flex items-center gap-2 rounded-full px-3 font-normal"
		aria-label="검색"
	>
		<SearchIcon class="h-5 w-5" />
		<span class="flex items-center gap-1 opacity-60">
			<kbd class="kbd kbd-sm">Ctrl</kbd>
			<kbd class="kbd kbd-sm">K</kbd>
		</span>
	</button>

	{#if isModalOpen}
		<div
			use:portal
			bind:this={modalContainer}
			class="fixed inset-0 z-9999 flex items-start justify-center bg-black/50 p-4 pt-[15vh] backdrop-blur-xs"
			onclick={(e) => {
				if (e.target === e.currentTarget) {
					closeModal();
				}
			}}
			onkeydown={handleModalKeydown}
			tabindex="-1"
			role="dialog"
			aria-modal="true"
			data-testid="search-modal"
		>
			<div
				class="bg-base-200 border-base-300 flex w-full max-w-2xl flex-col overflow-hidden rounded-lg border shadow-2xl lg:w-[65vw] lg:max-w-[65vw]"
			>
				<!-- Search bar -->
				<div class="border-base-300 flex items-center gap-3 border-b p-4">
					<SearchIcon class="h-5 w-5 shrink-0 stroke-gray-400" />
					<input
						bind:this={modalInput}
						type="text"
						placeholder="검색어를 입력하세요..."
						bind:value={query}
						onkeydown={handleKeydown}
						class="text-base-content grow bg-transparent text-base outline-none placeholder:font-light"
					/>
					<kbd class="kbd kbd-xs">ESC</kbd>
					<button
						type="button"
						aria-label="Close"
						tabindex="-1"
						class="btn btn-ghost btn-circle btn-xs"
						onclick={closeModal}
					>
						<XMarkIcon class="h-5 w-5" />
					</button>
				</div>

				<!-- Results/Suggestions -->
				<div class="max-h-[60vh] overflow-y-auto p-2 lg:max-h-[65vh]" role="searchbox">
					{#if query}
						{#if processedResults.length > 0}
							<ul bind:this={resultsList} class="flex w-full flex-col gap-1 p-0">
								{#each processedResults as result, i (result.id)}
									<li
										class="{i === activeIndex
											? 'bg-base-300'
											: 'hover:bg-base-300'} overflow-hidden rounded-md"
										onmouseenter={() => {
											lastInteraction = 'mouse';
											activeIndex = i;
										}}
									>
										<div
											role="button"
											tabindex="0"
											onclick={() => {
												closeModal();
												goto(
													route('/blog/[slug]', { params: { slug: `${result.id}-${result.slug}` } })
												);
											}}
											onkeydown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													closeModal();
													goto(
														route('/blog/[slug]', {
															params: { slug: `${result.id}-${result.slug}` }
														})
													);
												}
											}}
											class="flex w-full cursor-pointer flex-col items-start gap-1 p-3 text-left font-normal"
										>
											<span class="text-base-content block w-full text-left text-sm font-bold">
												{result.title}
											</span>
											{#if result.rawContent}
												<div class="pointer-events-none w-full">
													<MarkdownSnippet
														rawMarkdown={result.rawContent}
														terms={Array.from(
															new Set([...result.terms, ...query.split(/\s+/), query.trim()])
														)}
													/>
												</div>
											{/if}
										</div>
									</li>
								{/each}
							</ul>
						{:else}
							<div class="flex flex-col items-center justify-center px-4 py-10 text-center">
								<!-- TODO: Translate 'Did you mean...' in the future -->
								<p class="text-base-content/50 mb-4 text-sm">Did you mean...</p>
								{#if suggestions.length > 0}
									<div class="flex flex-wrap items-center justify-center gap-2">
										{#each suggestions as suggestion, i (suggestion.suggestion)}
											<button
												class="link link-primary link-hover text-base font-normal"
												onclick={() => {
													query = suggestion.suggestion;
												}}
											>
												{suggestion.suggestion}
											</button>
											{#if i < suggestions.length - 1}
												<span class="text-base-content/30 text-sm">,</span>
											{/if}
										{/each}
									</div>
								{:else}
									<p class="text-base-content/40 mt-1 text-sm">...</p>
								{/if}
							</div>
						{/if}
					{:else}
						<div class="text-base-content/40 flex flex-col items-center justify-center py-12">
							<SearchIcon class="stroke-base-content/30 mb-2 h-10 w-10" />
							<p class="text-sm font-light">검색어를 입력하여 게시글을 찾아보세요.</p>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>
