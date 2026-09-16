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

	it('parses post metadata including optional changelog field', () => {
		expect(
			Post.parse({
				metadata: {
					id: 3,
					title: 'Dr Pepper',
					slug: 'dr-pepper',
					publicationDate: '2022-06-15',
					preview: '/dr-pepper.png',
					summary: 'Spicy soda review.',
					tags: ['beverage'],
					changelog: [
						{
							date: '2023-01-01',
							message: 'Updated flavor notes.'
						}
					]
				},
				content: 'Tastes unique'
			})
		).toEqual({
			metadata: {
				id: '3',
				title: 'Dr Pepper',
				slug: 'dr-pepper',
				publicationDate: new Date('2022-06-15'),
				preview: '/dr-pepper.png',
				summary: 'Spicy soda review.',
				tags: ['beverage'],
				changelog: [
					{
						date: new Date('2023-01-01'),
						message: 'Updated flavor notes.'
					}
				]
			},
			content: 'Tastes unique'
		});
	});
});
