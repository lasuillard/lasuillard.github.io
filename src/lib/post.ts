import { z } from 'zod';

/** Expected and required metadata for posts. */
export const Metadata = z
	.object({
		id: z.coerce.string().regex(
			// Only alphanumeric characters are allowed for the ID to prevent conflicts with slug in the URL.
			/^[0-9a-zA-Z]+/
		),
		title: z.string(),
		slug: z.string().optional(),
		publicationDate: z.coerce.date(),
		preview: z.string(),
		summary: z.string(),
		tags: z.array(z.string())
	})
	.strict();

export type Metadata = z.infer<typeof Metadata>;

export const Post = z
	.object({
		metadata: Metadata,
		content: z.string()
	})
	.strict();

export type Post = z.infer<typeof Post>;

/**
 * Returns a slice of the posts array based on page and pageSize.
 * @param posts Sorted array of posts.
 * @param page 1-based page number.
 * @param pageSize Number of posts per page.
 * @returns Array of sliced posts.
 */
export function getPaginatedPosts(posts: Post[], page: number, pageSize: number): Post[] {
	const startIndex = (page - 1) * pageSize;
	return posts.slice(startIndex, startIndex + pageSize);
}
