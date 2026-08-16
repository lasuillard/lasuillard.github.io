import MiniSearch from 'minisearch';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

let miniSearch: MiniSearch | undefined = undefined;
let enginePromise: Promise<MiniSearch> | undefined = undefined;

const processor = unified().use(remarkParse).use(remarkGfm);

/**
 * Clean up markdown tags, HTML elements, and formatting for better indexing.
 * @param markdown Raw markdown content.
 * @returns Cleaned text content.
 */
export function cleanMarkdown(markdown: string): string {
	const tree = processor.parse(markdown);

	let result = '';

	/**
	 * Visit nodes recursively to extract text.
	 * @param node AST node
	 */
	function visit(node: any) {
		if (node.type === 'text' || node.type === 'inlineCode' || node.type === 'code') {
			result += node.value;
		}
		if (node.children) {
			for (const child of node.children) {
				visit(child);
			}
		}
		if (['paragraph', 'heading', 'listItem', 'tableRow'].includes(node.type)) {
			result += ' ';
		}
	}

	visit(tree);

	return result.replace(/\s+/g, ' ').trim();
}

/**
 * Initialize search engine.
 * @param posts Posts to index.
 * @returns Initialized search engine.
 */
export async function _initEngine(posts?: any[]): Promise<MiniSearch> {
	console.debug('Initializing search engine');

	const options = {
		fields: ['metadata.slug', 'metadata.title', 'metadata.tags', 'content'],
		idField: 'metadata.id',
		storeFields: [
			'metadata.title',
			'metadata.slug',
			'metadata.publicationDate',
			'metadata.tags',
			'rawContent'
		],
		extractField: (document: any, fieldName: string) => {
			return fieldName.split('.').reduce((doc, key) => doc && doc[key], document);
		}
	};

	if (!posts) {
		console.debug('Loading pre-built search index');
		try {
			const response = await fetch('/api/search-index');
			if (!response.ok) {
				throw new Error(`Failed to fetch search index: ${response.status} ${response.statusText}`);
			}
			const data = await response.json();
			miniSearch = MiniSearch.loadJS(data, options);
		} catch (error) {
			console.error('Failed to load pre-built search index:', error);
			miniSearch = new MiniSearch(options);
		}
	} else {
		console.debug('Indexing documents on the fly');
		miniSearch = new MiniSearch(options);
		const cleanedPosts = posts.map((post) => ({
			...post,
			metadata: {
				...post.metadata,
				publicationDate: new Date(post.metadata.publicationDate).getTime()
			},
			content: cleanMarkdown(post.content || ''),
			rawContent: post.content
		}));
		await miniSearch.addAllAsync(cleanedPosts);
	}

	return miniSearch;
}

/**
 * Initializes the search engine (cached).
 * @param posts Posts to index.
 * @returns Promise resolving to search engine instance.
 */
export function initEngine(posts?: any[]): Promise<MiniSearch> {
	if (!enginePromise) {
		enginePromise = _initEngine(posts);
	}
	return enginePromise;
}

/**
 * Returns search engine initialization promise.
 * @returns Search engine promise. If not initialized returns `undefined`.
 */
export function getEnginePromise(): Promise<MiniSearch> | undefined {
	return enginePromise;
}

/**
 * Clear the initialized search engine and promise.
 * Used primarily for testing purposes to reset the global state.
 */
export function clearEngine() {
	miniSearch = undefined;
	enginePromise = undefined;
}

/**
 * Perform search using search engine with default sorting and limits.
 * @param query Search query text.
 * @param searchEngine MiniSearch engine instance.
 * @param limit Maximum number of results to return.
 * @returns Array of search results.
 */
export function performSearch(query: string, searchEngine: MiniSearch, limit = 5) {
	const results = searchEngine.search(query, {
		fuzzy: (term) => (term.length > 3 ? 0.2 : false),
		combineWith: 'AND'
	});

	results.sort(
		(a: any, b: any) =>
			b.score - a.score ||
			b['metadata.publicationDate'] - a['metadata.publicationDate'] ||
			a['metadata.title'].localeCompare(b['metadata.title'])
	);

	return results.slice(0, limit);
}

/**
 * Get suggestions for given query when no search results are found.
 * @param query Search query text.
 * @param searchEngine MiniSearch engine instance.
 * @param limit Maximum number of suggestions to return.
 * @returns Array of suggestions.
 */
export function getSuggestions(query: string, searchEngine: MiniSearch, limit = 5) {
	const rawSuggestions = searchEngine.autoSuggest(query, {
		fuzzy: 0.2
	});
	rawSuggestions.sort((a, b) => b.score - a.score);

	const finalSuggestions: typeof rawSuggestions = [];
	for (const s of rawSuggestions) {
		// Single words only
		if (s.suggestion.trim().includes(' ')) continue;

		// Prefix-based deduplication to avoid particle spam (e.g. github, github는, github에)
		const isDuplicate = finalSuggestions.some(
			(existing) =>
				s.suggestion.startsWith(existing.suggestion) || existing.suggestion.startsWith(s.suggestion)
		);

		if (!isDuplicate) {
			finalSuggestions.push(s);
		}
		if (finalSuggestions.length >= limit) break;
	}

	return finalSuggestions;
}

/**
 * Count the total number of occurrences of search terms in content.
 * @param markdown Raw markdown content.
 * @param terms Search terms to count.
 * @returns Total match count.
 */
export function countTermOccurrences(markdown: string, terms: string[]): number {
	if (!markdown || terms.length === 0) return 0;

	const text = cleanMarkdown(markdown);
	const validTerms = terms.map((t) => t.trim()).filter((t) => t.length > 0);

	if (validTerms.length === 0) return 0;

	const escapedTerms = validTerms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
	const regex = new RegExp(escapedTerms.join('|'), 'gi');
	const matches = text.match(regex);

	return matches ? matches.length : 0;
}

/**
 * Create a highlighted plain-text excerpt from raw markdown content for search results.
 * @param markdown Raw markdown content.
 * @param terms Search terms to highlight.
 * @param maxLength Maximum character length of excerpt.
 * @returns HTML string with highlighted matching terms.
 */
export function getExcerpt(markdown: string, terms: string[], maxLength = 400): string {
	if (!markdown) return '';

	// Clean markdown formatting to get plain text
	const text = cleanMarkdown(markdown);

	// Filter out empty terms and sort terms by length descending
	// to match longest terms first
	const validTerms = terms
		.map((t) => t.trim())
		.filter((t) => t.length > 0)
		.sort((a, b) => b.length - a.length);

	if (validTerms.length === 0) {
		const snippet = text.slice(0, maxLength);
		return escapeHtml(snippet) + (text.length > maxLength ? '...' : '');
	}
	const lowerText = text.toLowerCase();
	let bestIndex = -1;

	// Find the earliest occurrence index of any search term in the document text
	for (const term of validTerms) {
		const idx = lowerText.indexOf(term.toLowerCase());
		if (idx !== -1 && (bestIndex === -1 || idx < bestIndex)) {
			bestIndex = idx;
		}
	}

	// Extract a snippet window centered around the first matching term
	let snippet: string;
	if (bestIndex === -1) {
		snippet = text.slice(0, maxLength) + (text.length > maxLength ? '...' : '');
	} else {
		const start = Math.max(0, bestIndex - 40);
		const end = Math.min(text.length, start + maxLength);
		const leadingEllipsis = start > 0 ? '...' : '';
		const trailingEllipsis = end < text.length ? '...' : '';
		snippet = leadingEllipsis + text.slice(start, end) + trailingEllipsis;
	}

	// Escape HTML special characters before injecting highlight mark tags to
	// prevent XSS
	const escapedSnippet = escapeHtml(snippet);

	// Build a regular expression to match all search terms globally
	// and case-insensitively
	const escapedTerms = validTerms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
	const regex = new RegExp(escapedTerms.join('|'), 'gi');

	// Wrap matching terms in <mark> tags using the stylesheet class
	return escapedSnippet.replace(regex, (match) => `<mark class="search-highlight">${match}</mark>`);
}

/**
 * Escape HTML special characters in string.
 * @param str Input text.
 * @returns HTML-escaped string.
 */
function escapeHtml(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}
