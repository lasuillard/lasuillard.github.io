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
