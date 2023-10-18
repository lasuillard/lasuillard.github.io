// @vitest-environment jsdom
import { Post } from '$lib/post';
import * as Endpoint from '$routes/api/posts/+server';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

describe('GET /api/posts', () => {
	it('respond with list of all posts', async () => {
		const response = await Endpoint.GET();
		const data: Array<unknown> = await response.json();
		expect(() => z.array(Post).parse(data)).not.toThrow();
	});
});
