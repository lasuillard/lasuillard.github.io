import { getPost } from '$lib/server/post';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const post = await getPost(params.slug);
	return json(post);
};
