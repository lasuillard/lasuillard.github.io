import type { PageLoad } from './$types';

/** Expected and required metadata for posts. */
interface Metadata {
	title: string;
	publicationDate: Date;
	tags: string[];
}

export const load: PageLoad = async ({ params }) => {
	// TODO: Error handling if post not exists; on error it creates page with "500 Internal Error"
	const post = await import(`../${params.slug}.md`);

	// TODO: Derive date using Git; publication date from creation time + last modified time
	const metadata: Metadata = {
		...post.metadata,
		publicationDate: new Date(post.metadata.publicationDate)
	};

	// FIXME: Proper type annotation for mdsvex components?
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const content: any = post.default;

	return {
		metadata,
		content
	};
};
