export const prerender = true;

export const GET = async () => {
	// TODO: Generate RSS XML document from list of posts; https://www.w3schools.com/xml/xml_rss.asp
	const body = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>

  </channel>
</rss>`;
	const options = {
		headers: {
			'Cache-Control': 'no-cache', // TODO: Update cache policy; https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
			'Content-Type': 'application/xml'
		}
	};

	return new Response(body, options);
};
