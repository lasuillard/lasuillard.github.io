/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Post, getAllPosts, getPost } from '$lib/post';
import { describe, expect, it } from 'vitest';
import { omitKeys } from './utils';

describe(Post, () => {
	describe(Post.parseObj, () => {
		const sample = {
			slug: 'coke-and-cider',
			metadata: {
				title: 'Coke and Cider',
				publicationDate: '2023-10-12',
				tags: ['beverage', 'review']
			}
		};

		it('parses given JSON object class', () => {
			expect(Post.parseObj(sample)).toBeInstanceOf(Post);
		});

		// TODO: More strict interface checking
		//       ['extra fields', { ...sample, tasty: 'sparkling' }],
		//       ['extra metadata provided', { ...sample, metadata: { ...sample.metadata, whales: false } }]
		it.each([
			// Each for case description, input data
			['no slug', [omitKeys(sample, ['slug'])]],
			[
				'lacking metadata field',
				[
					['title', 'publicationDate', 'tags'].map((key) => ({
						...sample,
						metadata: omitKeys(sample.metadata, [key])
					}))
				]
			]
		])('throws an error if unable to parse (%s)', (_, input) => {
			input.forEach((item) => {
				expect(() => Post.parseObj(item)).toThrowError(/^Failed to parse object: (.+)$/);
			});
		});
	});
});

describe(getPost, () => {
	it('returns post', () => {
		expect(getPost('lorem-ipsum')).resolves.toBeTruthy();
	});

	it('should return null if not exists', () => {
		expect(getPost('polar-bear-drinking-cider')).resolves.toBeNull();
	});

	it.todo('throws an error if post metadata schema not satisfactory');
});

describe(getAllPosts, () => {
	it('loads all posts successfully', async () => {
		const allPosts = await getAllPosts();
		expect(allPosts.length).greaterThan(0);
	});

	it.todo("throws an error if any of posts' metadata unsatisfying");
});
