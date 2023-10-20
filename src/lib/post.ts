import { z } from 'zod';
import { defaultLanguage } from './i18n';
import { parse } from './markdown';

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
		id: z.string(),
		slug: z.string(),
		lang: z.string(), // TODO: Validate language code listed in ISO639
		metadata: Metadata,
		content: z.string()
	})
	.strict();

export type Post = z.infer<typeof Post>;

/**
 * Return post matching slug.
 * @param id Post identifier.
 * @param lang Preferred language.
 * @returns Post if (preferred language or fallback) exists, otherwise `null`.
 */
export async function getPost(id: string, lang?: string): Promise<Post | null> {
	// FIXME: Possible performance bottleneck in future
	const posts = (await getAllPosts()).filter((p) => p.id === id);
	if (!posts.length) {
		return null;
	}

	// Fallback should always be available
	const fallback = posts.find((p) => p.lang === defaultLanguage);
	if (!fallback) {
		throw new Error(`Fallback not found for ID '${id}' but fallback not exists`);
	}

	return posts.find((p) => p.lang === lang) || fallback;
}

/**
 * Find and return all posts.
 * @returns Array of posts. If none found, will be empty.
 */
export async function getAllPosts(): Promise<Post[]> {
	// Expects .../[id]/[slug].[lang].md
	const pattern = /^.*\/(.+?)\/(.+?)(?:\.([a-z]{2}))\.md/;

	const allPostFiles = import.meta.env.DEV
		? import.meta.glob('../../tests/fixtures/posts/**/*.md', { as: 'raw' })
		: import.meta.glob(`../../posts/**/*.md`, { as: 'raw' });

	const allPosts = await Promise.all(
		Object.entries(allPostFiles).map(async ([filepath, resolver]) => {
			const text = z.string().parse(await resolver());
			const { frontMatter, content } = await parse(text);
			const metadata = Metadata.parse(frontMatter);
			const match = filepath.match(pattern);
			if (!match) {
				throw new Error(`Path not matching pattern: '${filepath}'`);
			}
			const [, id, slug, lang] = match;

			return Post.parse({
				id,
				slug,
				lang,
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
