import { describe, expect, it } from 'vitest';
import { Post } from '~/lib/post';
import { getVarName, omitKeys } from '~/lib/utils';

describe(getVarName({ Post }), () => {
	const sample = {
		slug: 'coke-and-cider',
		metadata: {
			title: 'Coke and Cider',
			publicationDate: '2020-04-13T00:00:00.000+09:00',
			preview: '/lorem-ipsum.png',
			summary: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
			tags: ['beverage', 'review']
		},
		content: 'Polar bear'
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
