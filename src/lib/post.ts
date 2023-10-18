import path from 'path';
import type { SvelteComponent } from 'svelte';
import { z } from 'zod';

/** Expected and required metadata for posts. */
export const Metadata = z
	.object({
		title: z.string(),
		publicationDate: z.coerce.date(),
		tags: z.array(z.string())
	})
	.strict();

export type Metadata = z.infer<typeof Metadata>;

export const Post = z
	.object({
		slug: z.string(),
		metadata: Metadata
	})
	.strict();

export type Post = z.infer<typeof Post>;

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
		post = import.meta.env.DEV
			? await import(`/tests/fixtures/posts/${slug}.md` /* @vite-ignore */)
			: await import(`/posts/${slug}.md`);
	} catch (err) {
		console.error(`Matching post not found: ${err}`);
		return null;
	}

	return {
		metadata: Metadata.parse(post.metadata),
		content: post.default
	};
}

/**
 * Find and return all posts.
 * @returns Array of posts. If none found, will be empty.
 */
export async function getAllPosts(): Promise<Post[]> {
	const allPostFiles = import.meta.env.DEV
		? import.meta.glob('/tests/fixtures/posts/*.md')
		: import.meta.glob(`/posts/*.md`);
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
