import { Post } from '$lib/post';
import { z } from 'zod';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const response = await fetch('/api/posts');
	const data = await response.json();
	const allPosts = z.array(Post).parse(data);

	// Get recent 3 posts
	const recentPosts = allPosts.slice(0, 3);

	return {
		meta: {
			title: 'About Me',
			description: "lasuillard's blog."
		},
		recentPosts
	};
};
