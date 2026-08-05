import { PAGE_SIZE } from '$lib/constants';
import { Post } from '$lib/post';
import { z } from 'zod';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url }) => {
	const response = await fetch('/api/posts');
	const data = await response.json();
	const allPosts = z.array(Post).parse(data);

	const tag = url.searchParams.get('tag');
	const filteredPosts = tag
		? allPosts.filter((post) =>
				post.metadata.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
			)
		: allPosts;

	const pageParam = url.searchParams.get('page');
	let currentPage = 1;
	if (pageParam) {
		const parsed = parseInt(pageParam, 10);
		if (!isNaN(parsed) && parsed > 0) {
			currentPage = parsed;
		}
	}

	const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
	if (currentPage > totalPages) {
		currentPage = totalPages;
	}

	const paginatedPosts = filteredPosts.slice(
		(currentPage - 1) * PAGE_SIZE,
		currentPage * PAGE_SIZE
	);

	return {
		meta: {
			title: 'Blog',
			description: 'My writing about almost everything but primarily on S/W development.'
		},
		allPosts,
		paginatedPosts,
		currentPage,
		totalPages
	};
};
