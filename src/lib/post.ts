import { parse } from '$lib/markdown';
import { z } from 'zod';

/** Expected and required metadata for posts. */
export const Metadata = z
	.object({
		title: z.string(),
		publicationDate: z.coerce.date(),
		preview: z.string(),
		summary: z.string(),
		tags: z.array(z.string())
	})
	.strict();

export type Metadata = z.infer<typeof Metadata>;

export const Post = z
	.object({
		slug: z.string(),
		metadata: Metadata,
		content: z.string()
	})
	.strict();

export type Post = z.infer<typeof Post>;

/**
 * Return post matching slug.
 * @param slug Slug of post.
 * @returns Post if exists, otherwise `null`.
 */
export async function getPost(slug: string): Promise<Post | null> {
	let post;
	try {
		post = (
			import.meta.env.DEV
				? await import(`../../tests/fixtures/posts/${slug}.md?raw`)
				: await import(`../../posts/${slug}.md?raw`)
		).default;
	} catch (err) {
		console.error(`Matching post not found: ${err}`);
		return null;
	}

	const { frontMatter, content } = await parse(post);
	let metadata: Metadata;
	try {
		metadata = Metadata.parse(frontMatter);
	} catch (err) {
		if (err instanceof z.ZodError) {
			throw new Error(`Failed to parse post' metadata: ${err}`);
		}
		throw err;
	}

	return Post.parse({
		slug,
		metadata,
		content
	});
}

/**
 * Find and return all posts.
 * @returns Array of posts. If none found, will be empty.
 */
export async function getAllPosts(): Promise<Post[]> {
	const pattern = /^.*\/(.+?)\.md$/;
	const allPostFiles = import.meta.env.DEV
		? import.meta.glob('../../tests/fixtures/posts/*.md', { as: 'raw' })
		: import.meta.glob(`../../posts/*.md`, { as: 'raw' });

	const allPosts = await Promise.all(
		Object.entries(allPostFiles).map(async ([filepath, resolver]) => {
			const text = z.string().parse(await resolver());
			const { frontMatter, content } = await parse(text);
			const metadata = Metadata.parse(frontMatter);
			const [, slug] = filepath.match(pattern) ?? [];

			return Post.parse({
				slug,
				metadata,
				content
			});
		})
	).catch((err) => {
		if (err) {
			console.error(`Failed to load all posts: ${err}`);
		}
		return [];
	});

	return allPosts;
}
