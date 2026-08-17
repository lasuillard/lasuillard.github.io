import { postRepository } from '$lib/server/post';
import { cleanMarkdown } from '$lib/search';
import { json } from '@sveltejs/kit';
import MiniSearch from 'minisearch';

export const prerender = true;

export const GET = async () => {
	const allPosts = await postRepository.getAllPosts();

	const miniSearch = new MiniSearch({
		fields: ['metadata.slug', 'metadata.title', 'metadata.tags', 'content'],
		idField: 'metadata.id',
		storeFields: [
			'metadata.title',
			'metadata.slug',
			'metadata.publicationDate',
			'metadata.tags',
			'rawContent'
		],
		extractField: (document: any, fieldName: string) => {
			return fieldName.split('.').reduce((doc, key) => doc && doc[key], document);
		}
	});

	const documents = allPosts.map((post) => ({
		...post,
		metadata: {
			...post.metadata,
			publicationDate: new Date(post.metadata.publicationDate).getTime()
		},
		content: cleanMarkdown(post.content),
		rawContent: post.content
	}));

	miniSearch.addAll(documents);

	return json(miniSearch.toJSON());
};
