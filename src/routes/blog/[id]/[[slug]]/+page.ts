import { getPost } from '$lib/post';
import { error, redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, route }) => {
	const post = await getPost(params.id);
	if (!post) {
		throw error(404, { message: 'Not Found' });
	}

	// Redirect to correct slug
	if (params.slug != post.slug) {
		// FIXME: This looks little bit dirty and unsafe. Better solution?
		const pathWithCorrectSlug = route.id.replace('[id]', params.id).replace('[[slug]]', post.slug);
		throw redirect(301, pathWithCorrectSlug);
	}
	const { metadata, content } = post;

	return {
		metadata,
		content
	};
};
