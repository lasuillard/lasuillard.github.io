// @vitest-environment happy-dom
import { describe, expect, it, vi, afterEach } from 'vitest';
import {
	countTermOccurrences,
	getEngine,
	initEngine,
	cleanMarkdown,
	performSearch,
	getSuggestions,
	getExcerpt
} from '~/lib/search';
import { Post } from '~/lib/post';

describe('countTermOccurrences', () => {
	it('returns 0 for empty content or empty terms', () => {
		expect(countTermOccurrences('', ['test'])).toBe(0);
		expect(countTermOccurrences('sample text', [])).toBe(0);
	});

	it('counts total term occurrences in markdown content', () => {
		const raw = '### Title\nSvelte is great. SvelteKit uses Svelte for building apps.';
		expect(countTermOccurrences(raw, ['svelte'])).toBe(3);
	});
});

describe('cleanMarkdown', () => {
	it('removes markdown styling and HTML tags', () => {
		const raw = '### Title\nThis is a [test](link) with <img src="img.png" /> and `code`.';
		const expected = 'Title This is a test with and code.';
		expect(cleanMarkdown(raw)).toBe(expected);
	});
});

describe('getExcerpt', () => {
	it('returns empty string for empty input', () => {
		expect(getExcerpt('', ['test'])).toBe('');
	});

	it('extracts excerpt and highlights matched terms with mark tags', () => {
		const raw = '### Title\nThis is a sample markdown post containing special term inside content.';
		const excerpt = getExcerpt(raw, ['special']);
		expect(excerpt).toContain('<mark class="search-highlight">special</mark>');
		expect(excerpt).not.toContain('###');
	});

	it('escapes HTML special characters inside snippet to prevent XSS', () => {
		const raw = 'Text with & < > and target term.';
		const excerpt = getExcerpt(raw, ['target']);
		expect(excerpt).toContain('&amp; &lt; &gt;');
		expect(excerpt).toContain('<mark class="search-highlight">target</mark>');
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

describe('performSearch', () => {
	it('performs search and respects limit', async () => {
		const posts = [
			Post.parse({
				metadata: {
					id: '1',
					slug: 'post-1',
					title: 'First Post',
					publicationDate: new Date('2024-01-01'),
					preview: '/preview.png',
					summary: 'summary 1',
					tags: ['svelte']
				},
				content: 'Svelte kit web application'
			}),
			Post.parse({
				metadata: {
					id: '2',
					slug: 'post-2',
					title: 'Second Post',
					publicationDate: new Date('2024-01-02'),
					preview: '/preview.png',
					summary: 'summary 2',
					tags: ['svelte']
				},
				content: 'Svelte framework guide'
			})
		];
		const engine = await initEngine(posts);

		const results = performSearch('Svelte', engine, 1);
		expect(results.length).toBe(1);
		// Should sort by publicationDate desc
		expect(results[0].id).toBe('2');
	});
});

describe('getSuggestions', () => {
	it('returns suggestions for misspelled query', async () => {
		const posts = [
			Post.parse({
				metadata: {
					id: '1',
					slug: 'post-1',
					title: 'First Post',
					publicationDate: new Date(),
					preview: '/preview.png',
					summary: 'summary',
					tags: ['javascript']
				},
				content: 'JavaScript programming language'
			})
		];
		const engine = await initEngine(posts);

		const suggestions = getSuggestions('javascrip', engine);
		expect(suggestions.length).toBeGreaterThan(0);
		expect(suggestions[0].suggestion).toBe('javascript');
	});
});
