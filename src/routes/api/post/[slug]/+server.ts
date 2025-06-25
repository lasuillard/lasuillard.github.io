import { postRepository } from '$lib/server/post';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const post = await postRepository.findPostById(params.slug);
	if (post) {
		return json(post);
	}
	error(404, `Post with slug '${params.slug}' not found`);
};
