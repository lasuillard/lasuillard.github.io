import { getPost } from '$lib/post';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const post = await getPost(params.slug);
	if (!post) {
		throw error(404, { message: 'Not Found' });
	}
	const { metadata, content } = post;

	return {
		title: metadata.title,
		metadata,
		content
	};
};
