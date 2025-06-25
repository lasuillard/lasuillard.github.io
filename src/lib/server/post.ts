import { Metadata, Post } from '$lib/post';
import { parse } from '$lib/server/markdown';
import _ from 'lodash';
import path from 'node:path';
import { z } from 'zod';

export class PostRepository {
	private posts: Post[];

	constructor() {
		this.posts = [];
	}

	/**
	 * Find and return all posts.
	 * @returns Array of posts. If none found, will be empty.
	 */
	async getAllPosts(): Promise<Post[]> {
		if (this.posts.length > 0) {
			return this.posts;
		}

		// Retrieve all post files from the filesystem
		const allPostFiles = import.meta.glob(`../../../static/posts/*/index.md`, {
			query: '?raw',
			import: 'default'
		});

		this.posts = await Promise.all(
			Object.entries(allPostFiles).map(async ([filepath, resolver]) => {
				const text = z.string().parse(await resolver());
				const { frontMatter, content } = await parse(text, {
					// e.g. ../../posts/1/index.md -> /posts/1/index.md
					filepath: path.resolve(filepath)
				});
				const metadata = Metadata.parse(frontMatter);

				// ? kebab-case is not strictly a slug, but a kebab-case version of the title would suffice for now.
				const slug = _.kebabCase(metadata.title);

				return Post.parse({
					metadata: {
						...metadata,
						slug: metadata.slug || slug
					},
					content
				});
			})
		).catch((err) => {
			if (err) {
				console.error(`Failed to load all posts: ${err}`);
			}
			return [];
		});
		return this.posts;
	}

	/**
	 * Find a post by its ID.
	 * @param id The ID of the post to find.
	 * @returns The post if found, otherwise null.
	 */
	async findPostById(id: string): Promise<Post | null> {
		const allPosts = await this.getAllPosts();
		const post = allPosts.find((post) => post.metadata.id === id);
		return post ?? null;
	}
}

// Export a singleton instance for app-wide use
export const postRepository = new PostRepository();
