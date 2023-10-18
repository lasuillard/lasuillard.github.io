import type { SvelteComponent } from 'svelte';
import { z } from 'zod';
import { defaultLanguage } from './i18n';

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
		content: z.custom<typeof SvelteComponent>()
	})
	.strict();

export type Post = z.infer<typeof Post>;

/**
 * Return post matching slug.
 * @param id Post identifier.
 * @param lang Preferred language.
 * @returns Post if (preferred language or fallback) exists, otherwise `null`.
 */
export async function getPost(
	id: string,
	lang?: string // TODO: Language code type
): Promise<Post | null> {
	const posts = (await getAllPosts()).filter((post) => post.id == id);
	if (!posts.length) {
		return null;
	}

	// If there is any post for given ID, post for default language MUST exist
	const fallback = posts.find((p) => p.lang == defaultLanguage);
	if (posts.length && !fallback) {
		throw new Error(`${posts.length} posts found for id ${id} but fallback not exists`);
	}

	// BUG: False-positive warning; `fallback` can't be `undefined`
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	return lang ? posts.find((p) => p.lang == lang) : fallback;
}

/**
 * Find and return all posts.
 * @returns Array of posts. If none found, will be empty.
 */
// FIXME: Return never changes but repeatedly called; cache it
export async function getAllPosts(): Promise<Post[]> {
	// Expects .../[id]/[slug].[lang].md
	const pattern = /^.*\/(.+?)\/(.+?)(?:\.([a-z]{2}))\.md/;

	const allPostFiles = import.meta.env.DEV
		? import.meta.glob('../../tests/fixtures/posts/**/*.md')
		: import.meta.glob('../../posts/**/*.md');

	const allPosts = await Promise.all(
		Object.entries(allPostFiles).map(async ([filepath, resolver]) => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			const post: {
				metadata: unknown;
				default: typeof SvelteComponent;
			} = await resolver();

			const { metadata } = post;
			const content = post.default;

			const match = filepath.match(pattern);
			if (!match) {
				throw new Error(`Path not matching pattern: ${filepath}`);
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
	);

	return allPosts;
}
