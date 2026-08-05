import { describe, expect, it } from 'vitest';
import { Post, getPaginatedPosts } from '~/lib/post';

describe('`Post` schema', () => {
	it('parses given JSON object class', () => {
		expect(
			Post.parse({
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
			})
		).toEqual({
			metadata: {
				id: '1',
				title: 'Coke and Cider',
				slug: 'coke-and-cider',
				publicationDate: new Date('2020-04-13T00:00:00.000+09:00'),
				preview: '/lorem-ipsum.png',
				summary: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
				tags: ['beverage', 'review']
			},
			content: 'Polar bear'
		});
	});
});

describe('getPaginatedPosts', () => {
	it('slices the posts array correctly', () => {
		const dummyPost = (id: number) => ({
			metadata: {
				id: String(id),
				title: `Post ${id}`,
				slug: `post-${id}`,
				publicationDate: new Date(),
				preview: '',
				summary: '',
				tags: []
			},
			content: ''
		});
		const posts = Array.from({ length: 12 }, (_, i) => dummyPost(i + 1));

		const page1 = getPaginatedPosts(posts, 1, 5);
		expect(page1.length).toBe(5);
		expect(page1[0].metadata.id).toBe('1');
		expect(page1[4].metadata.id).toBe('5');

		const page3 = getPaginatedPosts(posts, 3, 5);
		expect(page3.length).toBe(2);
		expect(page3[0].metadata.id).toBe('11');
		expect(page3[1].metadata.id).toBe('12');
	});
});
