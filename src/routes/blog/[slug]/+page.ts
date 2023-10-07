import type { Metadata } from '$lib/post';
import { error } from '@sveltejs/kit';
import type { SvelteComponent } from 'svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	let post;

	try {
		post = await import(`../${params.slug}.md`);
	} catch (err) {
		console.error(`Matching post not found: ${err}`);
		throw error(404, { message: 'Not Found' });
	}

	// TODO: Derive date using Git; publication date from creation time + last modified time
	const metadata: Metadata = {
		...post.metadata,
		publicationDate: new Date(post.metadata.publicationDate)
	};
	const content: typeof SvelteComponent = post.default;

	return {
		metadata,
		content
	};
};
