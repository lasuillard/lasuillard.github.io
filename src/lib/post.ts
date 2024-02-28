import { parse } from '$lib/markdown';
import { z } from 'zod';
import { getVarName, omitKeys } from './utils';

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
	//The glob option "as" has been deprecated in favour of "query". Please update `as: 'raw'` to `query: '?raw', import: 'default'`. (x2)
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

/* c8 ignore start */
if (import.meta.vitest) {
	const { describe, expect, it } = import.meta.vitest;

	describe(getVarName({ Post }), () => {
		const sample = {
			slug: 'coke-and-cider',
			metadata: {
				title: 'Coke and Cider',
				publicationDate: '2020-04-13T00:00:00.000+09:00',
				preview: '/lorem-ipsum.png',
				summary: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
				tags: ['beverage', 'review']
			},
			content: 'Polar bear'
		};

		it('parses given JSON object class', () => {
			expect(Post.parse(sample)).toEqual({
				...sample,
				metadata: {
					...sample.metadata,
					publicationDate: new Date('2020-04-13T00:00:00.000+09:00')
				}
			});
		});

		it.each([
			// Each for case description, input data
			['no slug', [omitKeys(sample, ['slug'])]],
			[
				'lacking metadata field',
				['title', 'publicationDate', 'tags'].map((key) => ({
					...sample,
					metadata: omitKeys(sample.metadata, [key])
				}))
			]
		])('throws an error if unable to parse (%s)', (_, input) => {
			input.forEach((item) => {
				expect(() => Post.parse(item)).toThrow();
			});
		});
	});

	describe(getPost, () => {
		it('returns post', async () => {
			const post = await getPost('puppis-artus-attoniti-haud');
			expect(post).toBeTruthy();
		});

		it('should return null if not exists', async () => {
			const post = await getPost('polar-bear-drinking-cider');
			expect(post).toBeNull();
		});

		it.todo('throws an error if post metadata schema not satisfactory');
	});

	describe(getAllPosts, () => {
		it('loads all posts successfully', async () => {
			const allPosts = await getAllPosts();
			expect(allPosts).toHaveLength(3);
		});

		it.todo("throws an error if any of posts' metadata unsatisfying");
	});
}
/* c8 ignore stop */
