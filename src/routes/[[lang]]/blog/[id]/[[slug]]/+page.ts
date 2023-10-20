import { getPost } from '$lib/post';
import { error, redirect, resolvePath } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, route }) => {
	const post = await getPost(params.id);
	if (!post) {
		throw error(404, { message: 'Not Found' });
	}

	// Redirect to correct slug
	if (params.slug != post.slug) {
		// FIXME: This looks little bit dirty and unsafe. Better solution?
		throw redirect(
			301,
			resolvePath(route.id, {
				...params,
				slug: post.slug
			})
		);
	}
	const { metadata, content } = post;

	return {
		metadata,
		content
	};
};
