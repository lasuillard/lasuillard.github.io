import { Metadata, Post } from '$lib/post';
import { parse } from '$lib/server/markdown';
import { z } from 'zod';

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
				? await import(`../../../tests/fixtures/posts/${slug}.md?raw`) /* c8 ignore next */
				: await import(`../../../posts/${slug}.md?raw`)
		).default;
	} catch (err) {
		console.error(`Matching post not found: ${err}`);
		return null;
	}

	const { frontMatter, content } = await parse(post);
	const metadata = Metadata.parse(frontMatter);

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
			? import.meta.glob('../../../tests/fixtures/posts/*.md', {
					query: '?raw',
					import: 'default'
				}) /* c8 ignore next */
			: import.meta.glob(`../../../posts/*.md`, { query: '?raw', import: 'default' });
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
