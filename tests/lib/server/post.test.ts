// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { PostRepository } from '~/lib/server/post';

describe('PostRepository.getAllPosts', () => {
	it('loads all posts successfully', async () => {
		const postRepository = new PostRepository();
		const allPosts = await postRepository.getAllPosts();
		expect(allPosts.length).toBeGreaterThan(0);
	});
});

describe('PostRepository.findPostById', () => {
	it('returns post', async () => {
		const postRepository = new PostRepository();
		const post = await postRepository.findPostById('1');
		expect(post).toBeTruthy();
	});

	it('should return null if not exists', async () => {
		const postRepository = new PostRepository();
		const post = await postRepository.findPostById('nonexistent-id');
		expect(post).toBeNull();
	});
});
