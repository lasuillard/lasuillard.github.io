// @vitest-environment happy-dom
import { describe, expect, it, vi, afterEach } from 'vitest';
import { getEngine, initEngine, cleanMarkdown } from '~/lib/search';
import { Post } from '~/lib/post';

describe('cleanMarkdown', () => {
	it('removes markdown styling and HTML tags', () => {
		const raw = '### Title\nThis is a [test](link) with <img src="img.png" /> and `code`.';
		const expected = 'Title This is a test with and code.';
		expect(cleanMarkdown(raw)).toBe(expected);
	});
});

describe('getEngine', () => {
	it('returns undefined when not initialized', () => {
		expect(getEngine()).toBeUndefined();
	});

	it('returns engine instance after initialization', async () => {
		const testPost = Post.parse({
			metadata: {
				id: '1',
				slug: 'test-post',
				title: 'Test Post',
				publicationDate: new Date(),
				preview: '/preview.png',
				summary: 'summary',
				tags: ['test']
			},
			content: 'This contains some unique-search-word content.'
		});

		const engine = await initEngine([testPost]);
		expect(getEngine()).toBe(engine);

		const results = engine.search('unique-search-word');
		expect(results.length).toBe(1);
		expect(results[0].id).toBe('1');
	});

	describe('when posts are not provided', () => {
		afterEach(() => {
			vi.unstubAllGlobals();
		});

		it('fetches prebuilt index', async () => {
			const mockFetch = vi.fn().mockResolvedValue({
				ok: true,
				json: async () => ({
					documentCount: 0,
					nextId: 0,
					documentIds: {},
					fieldIds: {},
					fieldLength: {},
					averageFieldLength: {},
					index: {},
					storedFields: {}
				})
			});
			vi.stubGlobal('fetch', mockFetch);

			const engine = await initEngine();
			expect(engine).toBeDefined();
			expect(mockFetch).toHaveBeenCalledWith('/api/search-index');
		});

		it('falls back to empty index when fetch fails', async () => {
			const mockFetch = vi.fn().mockResolvedValue({
				ok: false,
				status: 500,
				statusText: 'Internal Server Error'
			});
			vi.stubGlobal('fetch', mockFetch);

			const engine = await initEngine();
			expect(engine).toBeDefined();
			expect(mockFetch).toHaveBeenCalledWith('/api/search-index');
			expect(engine.documentCount).toBe(0);
		});
	});
});
