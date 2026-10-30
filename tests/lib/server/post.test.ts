// @vitest-environment happy-dom
import { PostSchema } from "#lib/post.js";
import { PostRepository } from "#lib/server/post.js";
import { describe, expect, it } from "vitest";

describe("PostRepository.getAllPosts", () => {
  it("loads all posts successfully", async () => {
    const postRepository = new PostRepository();
    const allPosts = await postRepository.getAllPosts();
    expect(allPosts.length).toBeGreaterThan(0);
  });

  it("limits to the oldest N posts when maxPosts is specified", async () => {
    const fullRepo = new PostRepository();
    const allPosts = await fullRepo.getAllPosts();

    const limitedRepo = new PostRepository({ maxPosts: 5 });
    const limitedPosts = await limitedRepo.getAllPosts();

    expect(limitedPosts).toHaveLength(5);
    expect(limitedPosts).toEqual(allPosts.slice(-5));
  });

  it("returns empty array when maxPosts is zero", async () => {
    const limitedRepo = new PostRepository({ maxPosts: 0 });
    const limitedPosts = await limitedRepo.getAllPosts();

    expect(limitedPosts).toHaveLength(0);
    expect(limitedPosts).toEqual([]);
  });
});

describe("PostRepository.findPostById", () => {
  it("returns post matching PostSchema", async () => {
    const postRepository = new PostRepository();
    const post = await postRepository.findPostById("1");
    expect(post).not.toBeNull();
    const result = PostSchema.safeParse(post);
    expect(result.success).toBe(true);
  });

  it("should return null if not exists", async () => {
    const postRepository = new PostRepository();
    const post = await postRepository.findPostById("nonexistent-id");
    expect(post).toBeNull();
  });
});
