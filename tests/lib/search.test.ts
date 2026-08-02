// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
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
});
