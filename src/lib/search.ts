import { Post } from '$lib/post';
import MiniSearch from 'minisearch';
import { z } from 'zod';

let miniSearch: MiniSearch | undefined = undefined;

/**
 * Initialize search engine.
 * @param posts POsts to index.
 * @returns Initialized search engine.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function initEngine(posts?: any[]): Promise<MiniSearch> {
	console.debug('Initializing search engine');
	miniSearch = new MiniSearch({
		fields: [
			'metadata.slug',
			'metadata.title',
			// FIXME: Sanitize content HTML tags
			'metadata.tags'
		],
		idField: 'metadata.id',
		storeFields: ['metadata.title', 'metadata.publicationDate', 'metadata.tags'],
		extractField: (document, fieldName) => {
			return fieldName.split('.').reduce((doc, key) => doc && doc[key], document);
		}
	});

	// TODO: Search for document contents
	if (!posts) {
		console.debug('Loading post documents');
		const response = await fetch('/api/posts');
		const data = await response.json();
		const allPosts = z.array(Post).parse(data);

		posts = allPosts;
	}

	console.debug('Indexing documents');
	await miniSearch.addAllAsync(posts);

	return miniSearch;
}

/**
 * Returns search engine.
 * @returns Search engine instance. If not initialized returns `undefined`.
 */
export function getEngine(): MiniSearch | undefined {
	return miniSearch;
}
