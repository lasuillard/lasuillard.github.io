import { postRepository } from '$lib/server/post';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const allPosts = await postRepository.getAllPosts();

	return {
		meta: {
			title: 'Blog',
			description: 'My writing about almost everything but primarily on S/W development.'
		},
		allPosts
	};
};
