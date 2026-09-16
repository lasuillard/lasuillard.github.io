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
				publicationDate: new Date('2020-04-13T12:00:00+09:00'),
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
				publicationDate: new Date('2021-05-14T12:00:00+09:00'),
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
				publicationDate: new Date('2022-06-15T12:00:00+09:00'),
				preview: '/dr-pepper.png',
				summary: 'Spicy soda review.',
				tags: ['beverage'],
				changelog: [
					{
						date: new Date('2023-01-01T12:00:00+09:00'),
						message: 'Updated flavor notes.'
					}
				]
			},
			content: 'Tastes unique'
		});
	});

	it('preserves explicit timezone-aware timestamps in publicationDate and changelog', () => {
		expect(
			Post.parse({
				metadata: {
					id: 4,
					title: 'Mountain Dew',
					slug: 'mountain-dew',
					publicationDate: '2023-08-01T18:30:00+09:00',
					preview: '/dew.png',
					summary: 'Citrus soda review.',
					tags: ['beverage'],
					changelog: [
						{
							date: '2023-08-05T09:15:00+09:00',
							message: 'Added caffeine notes.'
						}
					]
				},
				content: 'Refreshing'
			})
		).toEqual({
			metadata: {
				id: '4',
				title: 'Mountain Dew',
				slug: 'mountain-dew',
				publicationDate: new Date('2023-08-01T18:30:00+09:00'),
				preview: '/dew.png',
				summary: 'Citrus soda review.',
				tags: ['beverage'],
				changelog: [
					{
						date: new Date('2023-08-05T09:15:00+09:00'),
						message: 'Added caffeine notes.'
					}
				]
			},
			content: 'Refreshing'
		});
	});

	it('preserves explicit Date instances without modifying their timestamps', () => {
		const utcMidnight = new Date('2023-08-01T00:00:00.000Z');
		expect(
			Post.parse({
				metadata: {
					id: 5,
					title: 'Sprite Zero',
					slug: 'sprite-zero',
					publicationDate: utcMidnight,
					preview: '/sprite-zero.png',
					summary: 'Zero sugar soda.',
					tags: ['beverage']
				},
				content: 'Crisp'
			})
		).toEqual({
			metadata: {
				id: '5',
				title: 'Sprite Zero',
				slug: 'sprite-zero',
				publicationDate: utcMidnight,
				preview: '/sprite-zero.png',
				summary: 'Zero sugar soda.',
				tags: ['beverage']
			},
			content: 'Crisp'
		});
	});
});
