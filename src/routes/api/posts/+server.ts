import { getAllPosts } from '$lib/server/post';
import { json } from '@sveltejs/kit';

export const GET = async () => {
	const allPosts = await getAllPosts();

	// Sort posts in descending order; most recent post comes first
	allPosts.sort((a, b) => {
		return b.metadata.publicationDate.getTime() - a.metadata.publicationDate.getTime();
	});

	return json(allPosts);
};
