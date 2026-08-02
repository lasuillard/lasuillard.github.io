import MiniSearch from 'minisearch';

let miniSearch: MiniSearch | undefined = undefined;

/**
 * Strip HTML tags and comments character-by-character to avoid CodeQL regular-expression HTML-injection warning.
 * @param text The input text.
 * @returns Text with HTML tags and comments stripped.
 */
function stripHtmlAndComments(text: string): string {
	let result = '';
	let inTag = false;
	let i = 0;
	while (i < text.length) {
		if (text.startsWith('<!--', i)) {
			const endIdx = text.indexOf('-->', i + 4);
			if (endIdx !== -1) {
				i = endIdx + 3;
			} else {
				i = text.length;
			}
			continue;
		}
		if (text[i] === '<') {
			inTag = true;
			i++;
			continue;
		}
		if (text[i] === '>') {
			inTag = false;
			result += ' ';
			i++;
			continue;
		}
		if (!inTag) {
			result += text[i];
		}
		i++;
	}
	return result;
}

/**
 * Clean up markdown tags, HTML elements, and formatting for better indexing.
 * @param markdown Raw markdown content.
 * @returns Cleaned text content.
 */
export function cleanMarkdown(markdown: string): string {
	let cleaned = markdown.replace(/```[a-z]*\n([\s\S]*?)\n```/g, '$1').replace(/`([^`]+)`/g, '$1');

	cleaned = stripHtmlAndComments(cleaned);

	return cleaned
		.replace(/!\[(.*?)\]\((.*?)\)/g, '$1')
		.replace(/\[(.*?)\]\((.*?)\)/g, '$1')
		.replace(/^\s*[-*+]\s+/gm, '')
		.replace(/^\s*\d+\.\s+/gm, '')
		.replace(/^#+\s+/gm, '')
		.replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
		.replace(/\s+/g, ' ')
		.trim();
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
		storeFields: ['metadata.title', 'metadata.slug', 'metadata.publicationDate', 'metadata.tags'],
		extractField: (document: any, fieldName: string) => {
			return fieldName.split('.').reduce((doc, key) => doc && doc[key], document);
		}
	};

	if (!posts) {
		console.debug('Loading pre-built search index');
		const response = await fetch('/api/search-index');
		const data = await response.json();
		miniSearch = MiniSearch.loadJS(data, options);
	} else {
		console.debug('Indexing documents on the fly');
		miniSearch = new MiniSearch(options);
		const cleanedPosts = posts.map((post) => ({
			...post,
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
