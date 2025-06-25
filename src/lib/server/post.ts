import { Metadata, Post } from '$lib/post';
import { parse } from '$lib/server/markdown';
import _ from 'lodash';
import { z } from 'zod';

/**
 * Return post matching id.
 * @param id Id of post.
 * @returns Post if exists, otherwise `null`.
 */
export async function getPost(id: string): Promise<Post | null> {
	const allPosts = await getAllPosts();
	const post = allPosts.find((post) => post.metadata.id === id);
	return post ?? null;
}

let allPosts: Post[] = [];

/**
 * Find and return all posts.
 * @returns Array of posts. If none found, will be empty.
 */
export async function getAllPosts(): Promise<Post[]> {
	if (allPosts.length > 0) {
		return allPosts;
	}

	const allPostFiles =
		import.meta.env.MODE === 'test'
			? import.meta.glob('../../../tests/fixtures/posts/*/index.md', {
					query: '?raw',
					import: 'default'
				}) /* c8 ignore next */
			: import.meta.glob(`../../../posts/*/index.md`, { query: '?raw', import: 'default' });

	allPosts = await Promise.all(
		Object.entries(allPostFiles).map(async ([, resolver]) => {
			const text = z.string().parse(await resolver());
			const { frontMatter, content } = await parse(text);
			const metadata = Metadata.parse(frontMatter);

			// ? kebab-case is not strictly a slug, but a kebab-case version of the title would suffice for now.
			const slug = _.kebabCase(metadata.title);

			return Post.parse({
				metadata: {
					...metadata,
					slug: metadata.slug || slug
				},
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
