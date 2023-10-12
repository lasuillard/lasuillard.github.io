// @vitest-environment jsdom
import * as Endpoint from '$routes/rss/+server';
import { describe, expect, it } from 'vitest';

describe('GET /rss', () => {
	it('returns an parsable XML document', async () => {
		const response = await Endpoint.GET();
		const data = await response.text();
		// Parse error example: <parsererror xmlns="http://www.mozilla.org/newlayout/xml/parsererror.xml">1:4: text data outside of root node.</parsererror>
		const xmlDoc = new DOMParser().parseFromString(data, 'text/xml');
		const content = xmlDoc.documentElement.outerHTML;
		expect(content).not.toContain('parsererror');
	});

	it.todo('returns cache policy headers');
});
