import { Post } from '$lib/post';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const response = await fetch('/api/posts');
	const allPosts: unknown[] = await response.json();

	return { allPosts: allPosts.map(Post.parseObj) };
};
