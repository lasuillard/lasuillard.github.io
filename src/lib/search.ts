import { Post } from '$lib/post';
import MiniSearch from 'minisearch';
import { z } from 'zod';

let miniSearch: MiniSearch | undefined = undefined;

/**
 * Initialize search engine.
 * @returns Initialized search engine.
 */
export async function initEngine(): Promise<MiniSearch> {
	console.debug('Initializing search engine');
	miniSearch = new MiniSearch({
		fields: ['slug', 'metadata.title', 'metadata.tags' /* FIXME: Sanitize content HTML tags */],
		idField: 'slug',
		storeFields: ['metadata.title', 'metadata.publicationDate', 'metadata.tags'],
		extractField: (document, fieldName) => {
			return fieldName.split('.').reduce((doc, key) => doc && doc[key], document);
		}
	});

	// TODO: Search for document contents
	console.debug('Loading post documents');
	const response = await fetch('/api/posts');
	const data = await response.json();
	const allPosts = z.array(Post).parse(data);

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

/* c8 ignore start */
if (import.meta.vitest) {
	const { describe, expect, it, vi } = import.meta.vitest;

	describe(initEngine, () => {
		it('engine is defined after initialization', async () => {
			expect(getEngine()).toBeUndefined();
			// @ts-expect-error Enough for mocking.
			vi.spyOn(globalThis, 'fetch').mockImplementationOnce(() => ({
				json: vi.fn(() => [])
			}));
			await initEngine();
			expect(getEngine()).toBeDefined();
		});
	});

	describe.todo(getEngine);
}
/* c8 ignore stop */
