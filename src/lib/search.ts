import { Post } from '$lib/post';
import MiniSearch from 'minisearch';

let miniSearch: MiniSearch | undefined = undefined;

/**
 * Initialize search engine.
 * @returns Initialized search engine.
 */
export async function initEngine(): Promise<MiniSearch> {
	console.debug('Initializing search engine');
	miniSearch = new MiniSearch({
		fields: ['slug', 'metadata.title', 'metadata.tags'],
		idField: 'slug',
		storeFields: ['metadata.title', 'metadata.publicationDate', 'metadata.tags'],
		extractField: (document, fieldName) => {
			return fieldName.split('.').reduce((doc, key) => doc && doc[key], document);
		}
	});

	// TODO: Search for document contents
	console.debug('Loading post documents');
	const response = await fetch('/api/posts');
	const data: unknown[] = await response.json();
	const allPosts = data.map(Post.parseObj);

	console.debug('Indexing documents');
	await miniSearch.addAllAsync(allPosts);

	return miniSearch;
}

/**
 * Returns search engine.
 * @returns Search engine instance. If not initialized returns `undefined`.
 */
export function getEngine(): MiniSearch | undefined {
	return miniSearch;
}
