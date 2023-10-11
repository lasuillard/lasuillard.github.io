import type { Post } from '$lib/post';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const { tag } = params;
	const response = await fetch('/api/posts');
	const allPosts: Post[] = await response.json();

	// Find posts with containing given tag (case-insensitive)
	let posts = allPosts.filter((post) =>
		post.metadata.tags.map((tag) => tag.toLowerCase()).includes(tag.toLowerCase())
	);

	// TODO: Refactor with typed clients
	posts = posts.map((post) => ({
		...post,
		metadata: {
			...post.metadata,
			publicationDate: new Date(post.metadata.publicationDate)
		}
	}));

	return {
		tag,
		posts
	};
};
