import path from 'path';
import type { SvelteComponent } from 'svelte';

/** Expected and required metadata for posts. */
export interface Metadata {
	title: string;
	publicationDate: Date;
	tags: string[];
}

export class Post {
	slug: string;
	metadata: Metadata;

	constructor(slug: string, metadata: Metadata) {
		this.slug = slug;
		this.metadata = metadata;
	}

	/**
	 * Parse given JSON object into post.
	 * @param obj Object to parse.
	 * @returns Converted post object.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static parseObj(obj: any): Post {
		// FIXME: Assert given object attributes in more precise way
		//        Consider validation library like Pydantic in Python
		if (typeof obj.slug !== 'string') {
			throw new Error('Failed to parse object: `slug` is not a string');
		}
		if (typeof obj.metadata.title !== 'string') {
			throw new Error('Failed to parse object: `metadata.title` is not a string');
		}
		if (typeof obj.metadata.publicationDate !== 'string') {
			throw new Error('Failed to parse object: `metadata.publicationDate` is not a string');
		}
		if (
			!(
				Array.isArray(obj.metadata.tags) &&
				(obj.metadata.tags as Array<unknown>).every((v) => typeof v === 'string')
			)
		) {
			throw new Error('Failed to parse object: `metadata.tags` is not a list of string');
		}

		return new Post(obj.slug, {
			title: obj.metadata.title,
			publicationDate: new Date(obj.metadata.publicationDate),
			tags: obj.metadata.tags
		});
	}
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
		// False-positive uncovered line
		/* c8 ignore next */
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
