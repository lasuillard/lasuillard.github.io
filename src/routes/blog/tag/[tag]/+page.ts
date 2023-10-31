import { Post } from '$lib/post';
import { z } from 'zod';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const { tag } = params;
	const response = await fetch('/api/posts');
	const data = await response.json();
	const allPosts = z.array(Post).parse(data);

	// Find posts with containing given tag (case-insensitive)
	const posts = allPosts.filter((post) =>
		post.metadata.tags.map((tag) => tag.toLowerCase()).includes(tag.toLowerCase())
	);

	return {
		title: tag,
		tag,
		posts
	};
};
