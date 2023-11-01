// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest';
import * as Endpoint from './+server';

describe('GET /rss.xml', () => {
	it('returns an parsable XML document', async () => {
		const response = await Endpoint.GET({
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			fetch: vi.fn(() => ({
				json: vi.fn(() => [
					{
						slug: 'lorem-ipsum',
						metadata: {
							title: 'Lorem Ipsum',
							publicationDate: '2020-04-13T13:09:28.333+09:00',
							tags: ['Apple', 'Watermelon', 'Orange']
						}
					}
				])
			}))
		});
		const data = await response.text();
		// Parse error example: <parsererror xmlns="http://www.mozilla.org/newlayout/xml/parsererror.xml">1:4: text data outside of root node.</parsererror>
		const xmlDoc = new DOMParser().parseFromString(data, 'text/xml');
		const content = xmlDoc.documentElement.outerHTML;
		expect(content).not.toContain('parsererror');
	});
});
