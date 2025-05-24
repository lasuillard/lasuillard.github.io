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
