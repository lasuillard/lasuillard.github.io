import { RECENT_POSTS_COUNT } from '$lib/constants';
import { postRepository } from '$lib/server/post';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const allPosts = await postRepository.getAllPosts();

	// Get recent posts (up to RECENT_POSTS_COUNT)
	const recentPosts = allPosts.slice(0, RECENT_POSTS_COUNT);

	return {
		meta: {
			title: 'About Me',
			description: "lasuillard's blog."
		},
		recentPosts
	};
};
