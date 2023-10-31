import { Post } from '$lib/post';
import { z } from 'zod';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const response = await fetch('/api/posts');
	const data = await response.json();
	const allPosts = z.array(Post).parse(data);

	return {
		meta: {
			title: 'Blog',
			description: 'My writing about almost everything but primarily on S/W development.'
		},
		allPosts
	};
};
