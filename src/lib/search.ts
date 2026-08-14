import MiniSearch from 'minisearch';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';

let miniSearch: MiniSearch | undefined = undefined;

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
export async function initEngine(posts?: any[]): Promise<MiniSearch> {
	console.debug('Initializing search engine');

	const options = {
		fields: ['metadata.slug', 'metadata.title', 'metadata.tags', 'content'],
		idField: 'metadata.id',
		storeFields: [
			'metadata.title',
			'metadata.slug',
			'metadata.publicationDate',
			'metadata.tags',
			'content'
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
			content: cleanMarkdown(post.content || '')
		}));
		await miniSearch.addAllAsync(cleanedPosts);
	}

	return miniSearch;
}

/**
 * Returns search engine.
 * @returns Search engine instance. If not initialized returns `undefined`.
 */
export function getEngine(): MiniSearch | undefined {
	return miniSearch;
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
		fuzzy: 0.2,
		combineWith: 'AND'
	});

	results.sort(
		(a: any, b: any) =>
			b['metadata.publicationDate'] - a['metadata.publicationDate'] ||
			b.score - a.score ||
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
	const rawSuggestions = searchEngine.autoSuggest(query, { fuzzy: 0.2 });
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
export function getExcerpt(markdown: string, terms: string[], maxLength = 200): string {
	if (!markdown) return '';

	const text = cleanMarkdown(markdown);
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

	for (const term of validTerms) {
		const idx = lowerText.indexOf(term.toLowerCase());
		if (idx !== -1 && (bestIndex === -1 || idx < bestIndex)) {
			bestIndex = idx;
		}
	}

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

	const escapedSnippet = escapeHtml(snippet);

	const escapedTerms = validTerms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
	const regex = new RegExp(escapedTerms.join('|'), 'gi');

	return escapedSnippet.replace(
		regex,
		(match) =>
			`<mark class="bg-warning text-warning-content rounded-xs px-1 font-bold">${match}</mark>`
	);
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
