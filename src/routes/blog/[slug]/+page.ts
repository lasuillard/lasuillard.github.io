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
		meta: {
			title: metadata.title,
			description: metadata.summary // TODO: Sanitize markdown syntax (transform into plain text)
		},
		metadata,
		content
	};
};
