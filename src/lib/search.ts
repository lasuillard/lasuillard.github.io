import MiniSearch from 'minisearch';

let miniSearch: MiniSearch | undefined = undefined;

/**
 * Clean up markdown tags, HTML elements, and formatting for better indexing.
 * @param markdown Raw markdown content.
 * @returns Cleaned text content.
 */
export function cleanMarkdown(markdown: string): string {
	let cleaned = markdown.replace(/```[a-z]*\n([\s\S]*?)\n```/g, '$1').replace(/`([^`]+)`/g, '$1');

	// Strip HTML comments
	cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');

	// Strip HTML tags safely, ensuring it starts with < and a letter or / to avoid stripping a < b
	cleaned = cleaned.replace(/<\/?[a-z][^>]*>/gi, '');

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
