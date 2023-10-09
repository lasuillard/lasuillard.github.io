// @vitest-environment jsdom
import * as Endpoint from '$lib/../routes/api/posts/+server.js';
import { describe, expect, it } from 'vitest';

describe('GET /api/posts', () => {
	it('respond with list of all posts', async () => {
		const response = await Endpoint.GET();
		// FIXME: Better type annotation and object matching
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const data: Array<any> = await response.json();
		data.forEach((item) => {
			expect(item).toMatchObject({
				slug: expect.any(String),
				metadata: {
					title: expect.any(String),
					publicationDate: expect.any(String),
					tags: expect.any(Array)
				}
			});
			item.metadata.tags.forEach((value: string) => {
				expect(value).toEqual(expect.any(String));
			});
		});
	});
});
