import { PAGE_SIZE } from '$lib/constants';
import { Post, getPaginatedPosts } from '$lib/post';
import { z } from 'zod';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url }) => {
	const response = await fetch('/api/posts');
	const data = await response.json();
	const allPosts = z.array(Post).parse(data);

	const pageParam = url.searchParams.get('page');
	let currentPage = 1;
	if (pageParam) {
		const parsed = parseInt(pageParam, 10);
		if (!isNaN(parsed) && parsed > 0) {
			currentPage = parsed;
		}
	}

	const totalPages = Math.max(1, Math.ceil(allPosts.length / PAGE_SIZE));
	if (currentPage > totalPages) {
		currentPage = totalPages;
	}

	const paginatedPosts = getPaginatedPosts(allPosts, currentPage, PAGE_SIZE);

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
