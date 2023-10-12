import { Post } from '$lib/post';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const { tag } = params;
	const response = await fetch('/api/posts');
	const data: unknown[] = await response.json();
	const allPosts = data.map(Post.parseObj);

	// Find posts with containing given tag (case-insensitive)
	const posts = allPosts.filter((post) =>
		post.metadata.tags.map((tag) => tag.toLowerCase()).includes(tag.toLowerCase())
	);

	return {
		tag,
		posts
	};
};
