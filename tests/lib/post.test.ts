/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getAllPosts, getPost } from '$lib/post';
import { describe, expect, it } from 'vitest';

describe(`${getPost.name}`, () => {
	it('returns post', () => {
		expect(getPost('lorem-ipsum')).resolves.toBeTruthy();
	});

	it('should return null if not exists', () => {
		expect(getPost('polar-bear-drinking-cider')).resolves.toBeNull();
	});
});

describe(`${getAllPosts.name}`, () => {
	it('loads all posts successfully', async () => {
		const allPosts = await getAllPosts();
		expect(allPosts.length).greaterThan(0);
	});

	it.todo('throws an error if post metadata unsatisfying');
});