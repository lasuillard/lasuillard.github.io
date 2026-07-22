import { Post } from '$lib/post';
import { postRepository } from '$lib/server/post';
import { z } from 'zod';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = async () => {
	const allPosts = await postRepository.getAllPosts();
	const allTags = new Set(allPosts.map((post) => post.metadata.tags).flat());

	return Array.from(allTags).map((tag) => ({ tag }));
};

export const load: PageServerLoad = async ({ params, fetch }) => {
	const { tag } = params;
	const response = await fetch('/api/posts');
	const data = await response.json();
	const allPosts = z.array(Post).parse(data);

	// Find posts with containing given tag (case-insensitive)
	const posts = allPosts.filter((post) =>
		post.metadata.tags.map((tag) => tag.toLowerCase()).includes(tag.toLowerCase())
	);

	return {
		meta: {
			title: tag,
			description: `My writing about ${tag}.`
		},
		tag,
		posts
	};
};
