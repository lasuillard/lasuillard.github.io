import type { Post } from '$lib/post';
import type { PageLoad } from './$types';

/**
 * Parse given object into post.
 * @param obj Object to parse.
 * @returns Converted post object.
 */
// FIXME: Better type annotation for type serialization / deserialization
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseObj(obj: any): Post {
	return {
		slug: obj.slug,
		metadata: {
			title: obj.metadata.title,
			publicationDate: new Date(obj.metadata.publicationDate),
			tags: obj.metadata.tags
		}
	};
}

export const load: PageLoad = async ({ fetch }) => {
	const response = await fetch('/api/posts');
	const allPosts: unknown[] = await response.json();

	return { allPosts: allPosts.map(parseObj) };
};
