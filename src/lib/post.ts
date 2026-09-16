import { z } from 'zod';

/** Coerce date string or Date to timezone-aware Date, defaulting date-only string input to noon Asia/Seoul (12:00:00+09:00). */
const coerceTimezoneDate = z.preprocess((val) => {
	if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val.trim())) {
		return `${val.trim()}T12:00:00+09:00`;
	}
	return val;
}, z.coerce.date());

/** Expected and required metadata for posts. */
export const Metadata = z
	.object({
		id: z.coerce.string().regex(
			// Only alphanumeric characters are allowed for the ID to prevent conflicts with slug in the URL.
			/^[0-9a-zA-Z]+/
		),
		title: z.string(),
		slug: z.string().optional(),
		publicationDate: coerceTimezoneDate,
		preview: z.string().optional().default('/no-image.svg'),
		summary: z.string(),
		tags: z.array(z.string()),
		series: z.string().optional(),
		changelog: z
			.array(
				z.object({
					date: coerceTimezoneDate,
					message: z.string()
				})
			)
			.optional()
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
