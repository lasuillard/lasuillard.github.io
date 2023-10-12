import { Post } from '$lib/post';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const { tag } = params;
	const response = await fetch('/api/posts');
	const allPosts: unknown[] = await response.json();

	// Find posts with containing given tag (case-insensitive)
	const posts = allPosts
		.map(Post.parseObj)
		.filter((post) =>
			post.metadata.tags.map((tag) => tag.toLowerCase()).includes(tag.toLowerCase())
		);

	return {
		tag,
		posts
	};
};
