import { describe, expect, it } from 'vitest';
import { Post } from '~/lib/post';
import { getVarName } from '~/lib/utils';

describe(getVarName({ Post }), () => {
	const sample = {
		metadata: {
			id: 1,
			title: 'Coke and Cider',
			slug: 'coke-and-cider',
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
				id: '1',
				publicationDate: new Date('2020-04-13T00:00:00.000+09:00')
			}
		});
	});
});
