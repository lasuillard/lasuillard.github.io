// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { escapeXml } from '~/lib/utils';
import { GET } from '../../src/routes/rss.xml/+server';

describe('escapeXml', () => {
	it('escapes special XML characters', () => {
		const raw = `Tom & Jerry <cat & mouse> "classic" 'show'`;
		expect(escapeXml(raw)).toBe(
			'Tom &amp; Jerry &lt;cat &amp; mouse&gt; &quot;classic&quot; &apos;show&apos;'
		);
	});

	it('returns plain string unchanged', () => {
		expect(escapeXml('Hello world')).toBe('Hello world');
	});
});

describe('GET /rss.xml', () => {
	it('serves valid XML response with content-type header', async () => {
		// Mock RequestEvent as GET does not require event parameters
		const response = await GET({} as Parameters<typeof GET>[0]);
		expect(response.status).toBe(200);
		expect(response.headers.get('Content-Type')).toBe('application/xml');

		const xml = await response.text();
		expect(xml).toContain('<rss version="2.0">');
		expect(xml).toContain('<channel>');
		expect(xml).toContain("lasuillard's Blog");
		expect(xml).toContain('</channel>');
		expect(xml).toContain('</rss>');
	});
});
