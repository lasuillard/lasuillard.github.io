import { postRepository } from '$lib/server/post';
import { error, json } from '@sveltejs/kit';
import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;

export const entries: EntryGenerator = async () => {
	const allPosts = await postRepository.getAllPosts();
	const allIds = new Set(allPosts.map((post) => post.metadata.id).flat());

	return Array.from(allIds).map((slug) => ({ slug }));
};

export const GET: RequestHandler = async ({ params }) => {
	const post = await postRepository.findPostById(params.slug);
	if (post) {
		return json(post);
	}
	error(404, `Post with slug '${params.slug}' not found`);
};
