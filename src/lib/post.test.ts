/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Post, getAllPosts, getPost } from '$lib/post';
import { getVarName, omitKeys } from '$lib/utils';
import { describe, expect, it } from 'vitest';

describe(getVarName({ Post }), () => {
	const sample = {
		id: 'non-numeric-id',
		slug: 'coke-and-cider',
		lang: 'ko',
		metadata: {
			title: 'Coke and Cider',
			publicationDate: '2020-04-13T00:00:00.000+09:00',
			tags: ['beverage', 'review']
		}
	};

	it('parses given JSON object class', () => {
		expect(Post.parse(sample)).toEqual({
			...sample,
			metadata: {
				...sample.metadata,
				publicationDate: new Date('2020-04-13T00:00:00.000+09:00')
			}
		});
	});

	it.each([
		// Each for case description, input data
		['no slug', [omitKeys(sample, ['slug'])]],
		[
			'lacking metadata field',
			['title', 'publicationDate', 'tags'].map((key) => ({
				...sample,
				metadata: omitKeys(sample.metadata, [key])
			}))
		]
	])('throws an error if unable to parse (%s)', (_, input) => {
		input.forEach((item) => {
			expect(() => Post.parse(item)).toThrow();
		});
	});
});

describe(getPost, () => {
	it('lookup post by ID', () => {
		expect(getPost('1')).resolves.toBeTruthy();
	});

	it('should return null if not exists', () => {
		expect(getPost('polar-bear-drinking-cider')).resolves.toBeNull();
	});
});

describe(getAllPosts, () => {
	it('loads all posts successfully', async () => {
		const allPosts = await getAllPosts();
		expect(allPosts).toHaveLength(3);
	});
});
