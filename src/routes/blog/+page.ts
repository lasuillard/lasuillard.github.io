import { Post } from '$lib/post';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const response = await fetch('/api/posts');
	const data: unknown[] = await response.json();
	const allPosts = data.map(Post.parseObj);

	return { allPosts };
};
