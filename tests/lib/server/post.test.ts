// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { getAllPosts, getPost } from '~/lib/server/post';

describe(getPost, () => {
	it('returns post', async () => {
		const post = await getPost('puppis-artus-attoniti-haud');
		expect(post).toBeTruthy();
	});

	it('should return null if not exists', async () => {
		const post = await getPost('polar-bear-drinking-cider');
		expect(post).toBeNull();
	});

	it.todo('throws an error if post metadata schema not satisfactory');
});

describe(getAllPosts, () => {
	it('loads all posts successfully', async () => {
		const allPosts = await getAllPosts();
		expect(allPosts).toHaveLength(3);
	});

	it.todo("throws an error if any of posts' metadata unsatisfying");
});
