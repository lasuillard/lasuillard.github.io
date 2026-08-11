import type { RequestHandler } from '@sveltejs/kit';
import { postRepository } from '$lib/server/post';
import { Feed } from 'feed';

export const prerender = true;

export const GET: RequestHandler = async () => {
	const siteUrl = 'https://lasuillard.github.io';
	const siteTitle = "lasuillard's Blog";
	const siteDescription = "lasuillard's personal tech blog.";

	const allPosts = await postRepository.getAllPosts();

	const feed = new Feed({
		title: siteTitle,
		description: siteDescription,
		id: siteUrl + '/',
		link: siteUrl,
		copyright: `Copyright ${new Date().getFullYear()}, ${siteTitle}`,
		generator: 'Feed for Node.js',
		feedLinks: {
			rss: `${siteUrl}/rss.xml`
		}
	});

	allPosts.forEach((post) => {
		const postLink = encodeURI(`${siteUrl}/blog/${post.metadata.id}-${post.metadata.slug}`);
		feed.addItem({
			title: post.metadata.title,
			id: postLink,
			link: postLink,
			description: post.metadata.summary,
			date: post.metadata.publicationDate
		});
	});

	const body = feed.rss2();

	const options = {
		headers: {
			'Cache-Control': 'max-age=0, s-maxage=3600',
			'Content-Type': 'application/xml'
		}
	};

	return new Response(body, options);
};
