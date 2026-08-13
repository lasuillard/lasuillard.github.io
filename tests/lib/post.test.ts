import { describe, expect, it } from 'vitest';
import { Post } from '~/lib/post';

describe('`Post` schema', () => {
	it('parses given JSON object class', () => {
		expect(
			Post.parse({
				metadata: {
					id: 1,
					title: 'Coke and Cider',
					slug: 'coke-and-cider',
					publicationDate: '2020-04-13',
					preview: '/lorem-ipsum.png',
					summary: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
					tags: ['beverage', 'review']
				},
				content: 'Polar bear'
			})
		).toEqual({
			metadata: {
				id: '1',
				title: 'Coke and Cider',
				slug: 'coke-and-cider',
				publicationDate: new Date('2020-04-13'),
				preview: '/lorem-ipsum.png',
				summary: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
				tags: ['beverage', 'review']
			},
			content: 'Polar bear'
		});
	});

	it('parses post metadata including optional series field', () => {
		expect(
			Post.parse({
				metadata: {
					id: 2,
					title: 'Fanta and Sprite',
					slug: 'fanta-and-sprite',
					publicationDate: '2021-05-14',
					preview: '/sprite.png',
					summary: 'Another review.',
					tags: ['beverage'],
					series: 'Soda Chronicles'
				},
				content: 'Yummy'
			})
		).toEqual({
			metadata: {
				id: '2',
				title: 'Fanta and Sprite',
				slug: 'fanta-and-sprite',
				publicationDate: new Date('2021-05-14'),
				preview: '/sprite.png',
				summary: 'Another review.',
				tags: ['beverage'],
				series: 'Soda Chronicles'
			},
			content: 'Yummy'
		});
	});
});
