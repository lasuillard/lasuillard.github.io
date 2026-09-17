import type { RequestHandler } from '@sveltejs/kit';
import { postRepository } from '$lib/server/post';
import { Feed } from 'rivu';

export const prerender = true;

export const GET: RequestHandler = async () => {
	const siteUrl = 'https://lasuillard.github.io';
	const siteTitle = "lasuillard's Blog";
	const siteDescription = "lasuillard's personal tech blog.";

	const allPosts = await postRepository.getAllPosts();

	const feed = new Feed({
		title: siteTitle,
		link: siteUrl,
		description: siteDescription,
		language: 'ko-KR',
		items: allPosts.map((post) => {
			const postLink = encodeURI(`${siteUrl}/blog/${post.metadata.id}-${post.metadata.slug}`);
			return {
				title: post.metadata.title,
				link: postLink,
				description: post.metadata.summary,
				guid: postLink,
				pubDate: post.metadata.publicationDate
			};
		})
	});
	const options = {
		headers: {
			// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
			'Cache-Control': 'max-age=0, s-maxage=3600',
			'Content-Type': 'application/xml'
		}
	};

	return new Response(feed.generate(), options);
};
