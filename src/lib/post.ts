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
			import.meta.env.MODE === 'test'
				? await import(`../../tests/fixtures/posts/${slug}.md?raw`) /* c8 ignore next */
				: await import(`../../posts/${slug}.md?raw`)
		).default;
	} catch (err) {
		console.error(`Matching post not found: ${err}`);
		return null;
	}

	const { frontMatter: metadata, content } = await parse(post);

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
	const allPostFiles =
		import.meta.env.MODE === 'test'
			? import.meta.glob('../../tests/fixtures/posts/*.md', {
					query: '?raw',
					import: 'default'
				}) /* c8 ignore next */
			: import.meta.glob(`../../posts/*.md`, { query: '?raw', import: 'default' });
	// The glob option "as" has been deprecated in favour of "query". Please update `as: 'raw'` to `query: '?raw', import: 'default'`. (x2)
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
