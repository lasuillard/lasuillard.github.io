import { Post } from '$lib/post';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
	const response = await fetch(`/api/post/${params.slug}`);
	if (!response.ok) {
		throw error(404, { message: 'Failed to fetch post' });
	}

	const data = await response.json();
	const post = Post.parse(data);
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
