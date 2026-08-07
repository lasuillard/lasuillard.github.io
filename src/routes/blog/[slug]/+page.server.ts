import type { Post } from '$lib/post';
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

export const load: PageServerLoad = async ({ params }) => {
	// * Expect the slug to be in the format "id-slug", e.g., "1-My-blog-post".
	// * The ID is used to fetch the post, while the slug is used for SEO-friendly URLs.
	const [id] = params.slug.split('-');

	const post = await postRepository.findPostById(id);
	if (!post) {
		throw error(404, { message: `Failed to fetch post.` });
	}

	const { metadata, content } = post;

	let seriesPosts: Post[] = [];
	if (metadata.series) {
		const allPosts = await postRepository.getAllPosts();
		seriesPosts = allPosts.filter((p) => p.metadata.series === metadata.series);
	}

	return {
		meta: {
			title: metadata.title,
			description: metadata.summary
		},
		metadata,
		content,
		seriesPosts
	};
};
