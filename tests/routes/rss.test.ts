// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { postRepository } from '$lib/server/post';
import { GET } from '../../src/routes/rss.xml/+server';

describe('GET /rss.xml', () => {
	it('serves valid XML response with content-type header and item fields', async () => {
		// Mock RequestEvent as GET does not require event parameters
		const response = await GET({} as Parameters<typeof GET>[0]);
		expect(response.status).toBe(200);
		expect(response.headers.get('Content-Type')).toBe('application/xml');

		const xml = await response.text();
		expect(xml).toContain('<rss version="2.0">');
		expect(xml).toContain('<channel>');
		expect(xml).toContain("lasuillard's Blog");

		const allPosts = await postRepository.getAllPosts();
		expect(allPosts.length).toBeGreaterThan(0);
		const firstPost = allPosts[0];

		expect(xml).toContain('<item>');
		expect(xml).toContain(`<title><![CDATA[${firstPost.metadata.title}]]></title>`);
		expect(xml).toContain(`<description><![CDATA[${firstPost.metadata.summary}`);
		expect(xml).toContain(
			encodeURI(
				`https://lasuillard.github.io/blog/${firstPost.metadata.id}-${firstPost.metadata.slug}`
			)
		);
		expect(xml).toContain('</channel>');
		expect(xml).toContain('</rss>');
	});
});
