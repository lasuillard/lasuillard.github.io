import path from 'path';
import type { SvelteComponent } from 'svelte';

/** Expected and required metadata for posts. */
export interface Metadata {
	title: string;
	publicationDate: Date;
	tags: string[];
}

export interface Post {
	slug: string;
	metadata: Metadata;
}

/**
 * Return post matching slug.
 * @param slug Slug of post.
 * @returns Post if exists, otherwise `null`.
 */
export async function getPost(
	slug: string
): Promise<{ metadata: Metadata; content: typeof SvelteComponent } | null> {
	let post;

	try {
		post = await import(`$routes/blog/${slug}.md`);
	} catch (err) {
		console.error(`Matching post not found: ${err}`);
		return null;
	}

	return {
		metadata: {
			...post.metadata,
			publicationDate: new Date(post.metadata.publicationDate)
		},
		content: post.default
	};
}

/**
 * Find and return all posts.
 * @returns Array of posts. If none found, will be empty.
 */
export async function getAllPosts(): Promise<Post[]> {
	// TODO: Manage post path at config
	const allPostFiles = import.meta.glob('/src/routes/blog/*.md');
	const allPosts = await Promise.all(
		Object.entries(allPostFiles).map(async ([filepath, resolver]) => {
			// FIXME: How to annotate type for this line?
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			const { metadata } = await resolver();
			const slug = path.parse(filepath).name; // TODO: Path relative to from `POSTS_DIR`

			return {
				slug,
				metadata: {
					...metadata,
					publicationDate: new Date(metadata.publicationDate)
				}
			};
		})
	);

	return allPosts;
}