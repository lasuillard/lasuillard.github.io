import { getAllPosts } from '$lib/post';
import type { RequestHandler } from '@sveltejs/kit';

export const prerender = true;

const siteUrl = 'https://lasuillard.github.io';
const siteTitle = "lasuillard's Blog";
const siteDescription = "lasuillard's personal tech blog.";

export const GET: RequestHandler = async () => {
	const allPosts = await getAllPosts();

	// TODO: Generate RSS XML document from list of posts; https://www.w3schools.com/xml/xml_rss.asp
	const body = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteTitle}</title>
    <description>${siteDescription}</description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${allPosts
			.map((post) => {
				// TODO: Description from post metadata (description or excerpt)
				const postLink = encodeURI(`${siteUrl}/blog/${post.slug}`);
				return `<item>
            <guid isPermaLink="true">${postLink}</guid>
            <title>${post.metadata.title}</title>
            <link>${postLink}</link>
            <description>${post.metadata.title}</description>
            <pubDate>${post.metadata.publicationDate.toUTCString()}</pubDate>
          </item>`;
			})
			.join('')}
  </channel>
</rss>`;
	const options = {
		headers: {
			// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
			'Cache-Control': 'max-age=0, s-maxage=3600',
			'Content-Type': 'application/xml'
		}
	};

	return new Response(body, options);
};
