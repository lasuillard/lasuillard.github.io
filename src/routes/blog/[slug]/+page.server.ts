import { Post } from '$lib/post';
import { postRepository } from '$lib/server/post';
import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = async () => {
	const allPosts = await postRepository.getAllPosts();
	const allSlugs = new Set(
		allPosts.map((post) => `${post.metadata.id}-${post.metadata.slug}`).flat()
	);

	return Array.from(allSlugs).map((slug) => ({ slug }));
};

export const load: PageServerLoad = async ({ fetch, params }) => {
	// * Expect the slug to be in the format "id-slug", e.g., "1-My-blog-post".
	// * The ID is used to fetch the post, while the slug is used for SEO-friendly URLs.
	const [id] = params.slug.split('-');

	const response = await fetch(`/api/post/${id}`);
	if (!response.ok) {
		throw error(response.status, { message: `Failed to fetch post.` });
	}

	const data = await response.json();
	const post = Post.parse(data);
	const { metadata, content } = post;

	return {
		meta: {
			title: metadata.title,
			description: metadata.summary
		},
		metadata,
		content
	};
};
