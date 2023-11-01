// @vitest-environment happy-dom
import { Post } from '$lib/post';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import * as Endpoint from './+server';

describe('GET /api/posts', () => {
	it('respond with list of all posts', async () => {
		const response = await Endpoint.GET();
		const data: Array<unknown> = await response.json();
		expect(() => z.array(Post).parse(data)).not.toThrow();
	});
});
