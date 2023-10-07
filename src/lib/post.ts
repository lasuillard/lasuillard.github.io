import path from 'path';

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
