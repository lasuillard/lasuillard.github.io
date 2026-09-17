import { expect, test, type Page } from '@playwright/test';
import { expectToHaveScreenshot } from '../../../helpers';

let page: Page;

test.beforeAll('go to post page', async ({ browser }, testInfo) => {
	const context = await browser.newContext(testInfo.project.use);
	page = await context.newPage();

	// Fix clock time to prevent relative date shifts over time
	await page.clock.setFixedTime(new Date('2026-09-16T12:00:00Z'));
});

test.describe('Visual regression', () => {
	// Captures the top hero region of a post with an associated series banner.
	test('article hero with series banner', async () => {
		await page.goto('/blog/1-기술-블로그-시작하기');

		const hero = page.getByTestId('article-hero');
		const series = page.getByTestId('series-widget');
		await expect(hero).toBeVisible();
		await expect(series).toBeVisible();

		await expectToHaveScreenshot(page, [hero, series], 'article-hero-series.png', {
			padding: 24,
			hide: [page.getByTestId('header-wrapper')]
		});
	});

	// Captures the hero region of a post featuring a changelog banner.
	// The changelog widget is expanded prior to snapshotting to visually verify its open state.
	test('article hero with changelog banner', async () => {
		await page.goto('/blog/3-남이-만든-open-api-스키마-테스트하기');

		const hero = page.getByTestId('article-hero');
		await expect(hero).toBeVisible();

		// Expand the changelog widget so its full list is captured
		const changelog = page.getByTestId('changelog-widget');
		await expect(changelog).toBeVisible();
		await page.getByTestId('changelog-header').click();
		const changelogList = page.getByTestId('changelog-list');
		await expect(changelogList).toBeVisible();

		await expectToHaveScreenshot(page, [hero, changelogList], 'article-hero-changelog.png', {
			padding: 24,
			hide: [page.getByTestId('header-wrapper')]
		});
	});

	// Captures an in-depth article section combining images, bulleted lists, subheadings,
	// and syntax-highlighted code blocks.
	test('article content and typography', async () => {
		await page.goto('/blog/3-남이-만든-open-api-스키마-테스트하기');

		const heading = page.getByRole('heading', { name: /OpenAPI란\?/ });
		const image = page.locator('article img[alt="Swagger"]');
		const subheading = page.getByRole('heading', { name: /OpenAPI Generator/ });
		const codeBlock = page.locator('pre').filter({ hasText: 'AuthenticationApi' }).first();

		await expect(heading).toBeVisible();
		await expect(image).toBeVisible();
		await expect(subheading).toBeVisible();
		await expect(codeBlock).toBeVisible();

		await expectToHaveScreenshot(
			page,
			[heading, image, subheading, codeBlock],
			'article-prose-viewport.png',
			{
				padding: 24,
				hide: [page.getByTestId('header-wrapper')]
			}
		);
	});

	// Captures the hover state of the floating Table of Contents.
	// Uses padding clipping to ensure its drop shadow and rounded corners are not clipped.
	test('floating table of contents', async () => {
		await page.goto('/blog/1-기술-블로그-시작하기');

		const series = page.getByTestId('series-widget');
		await expect(series).toBeVisible();
		const toc = page.getByTestId('toc');
		await expect(toc).toBeVisible();
		await toc.hover();

		// Wait for hover expansion transition (duration-300) to complete
		await page.waitForTimeout(350);
		await expectToHaveScreenshot(page, toc, 'toc-hover.png', {
			padding: 24,
			hide: [series]
		});
	});

	// Captures the post footer section containing the footnotes and the comments widget.
	test('post footer with footnotes and comment', async () => {
		await page.goto('/blog/1-기술-블로그-시작하기');

		const footnotes = page.locator('section.footnotes');
		// Disable smooth scroll to ensure instant navigation
		await page.evaluate(() => {
			document.documentElement.style.scrollBehavior = 'auto';
		});

		// Scroll footnotes into view first so lazy-loaded utterances iframe triggers loading
		await footnotes.evaluate((el) => {
			el.scrollIntoView({ block: 'start', behavior: 'instant' });
		});

		// Wait for actual utterances widget iframe to load and render
		const utterancesFrame = page.frameLocator('iframe.utterances-frame');
		await expect(utterancesFrame.locator('main.timeline')).toBeVisible();

		const comment = page.getByTestId('utterances');
		await expect(comment).toBeVisible();

		// Wait for all images to finish loading to avoid layout shifts
		await page.evaluate(async () => {
			const images = Array.from(document.querySelectorAll('img'));
			await Promise.all(
				images.map((img) => {
					if (img.complete) return Promise.resolve();
					return new Promise((resolve) => {
						img.addEventListener('load', resolve);
						img.addEventListener('error', resolve);
					});
				})
			);
		});

		try {
			await expectToHaveScreenshot(page, [footnotes, comment], 'article-footer-viewport.png', {
				padding: 24,
				hide: [page.getByTestId('header-wrapper'), page.getByTestId('toc')]
			});
		} finally {
			await page.evaluate(() => {
				document.documentElement.style.scrollBehavior = '';
			});
		}
	});
});

test('has a title and meta tags for SEO', async () => {
	expect(await page.title()).toMatch(/.+ • lasuillard's Blog/);
	expect(await page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy();
});

test.describe('Series widget', () => {
	test('does not render series widget for post without a series', async () => {
		await page.goto('/blog/2-개발을-위한-데이터베이스');
		const widget = page.getByTestId('series-widget');
		await expect(widget).not.toBeVisible();
	});

	test('renders series widget for post with a series', async () => {
		await page.goto('/blog/11-다시-git-hub-pages로-블로그-배포하기');
		const widget = page.getByTestId('series-widget');
		await expect(widget).toBeVisible();
		await expect(widget.locator('h3')).toContainText('기술 블로그 운영하기');
	});

	test('navigates via series widget and updates active state on post 6', async () => {
		await page.goto('/blog/11-다시-git-hub-pages로-블로그-배포하기');
		const widget = page.getByTestId('series-widget');
		const secondItemLink = widget.locator('ul > li').nth(1).locator('a');

		// Click the link to navigate to Post 6
		await secondItemLink.click();
		await page.waitForURL('**/blog/6-*');

		// Wait for the old page/widget to detach/disappear completely
		await expect(page.getByTestId('series-widget')).toHaveCount(1);

		// On Post 6, the series widget should also be visible
		const newWidget = page.getByTestId('series-widget');
		await expect(newWidget).toBeVisible();
	});
});

test.describe('Changelog widget', () => {
	test('does not render changelog widget for post without changelog', async () => {
		await page.goto('/blog/1-기술-블로그-시작하기');
		const widget = page.getByTestId('changelog-widget');
		await expect(widget).not.toBeVisible();
	});

	test('renders changelog widget for post with changelog', async () => {
		await page.goto('/blog/3-남이-만든-open-api-스키마-테스트하기');
		const widget = page.getByTestId('changelog-widget');
		await expect(widget).toBeVisible();
		await expect(widget.locator('h3')).toContainText('변경 이력');
	});
});

test.describe('Section tracking and auto-scroll', () => {
	test('tracks current section in URL and highlights in ToC on scroll', async ({ page }) => {
		await page.route('**/utteranc.es/**', (route) => route.abort());
		await page.goto('/blog/11-다시-git-hub-pages로-블로그-배포하기');

		// Wait for content and TOC to be ready and visible
		const toc = page.getByTestId('toc').and(page.locator(':visible')).first();
		await expect(toc).toBeVisible();

		// Initially, the hash in URL should be empty
		expect(page.url()).not.toContain('#');

		// Hover to expand the floating ToC so links become visible
		await toc.hover();

		// Dynamically find the first heading link in ToC
		const headingLink = toc.locator('a[href^="#"]').first();
		const href = await headingLink.getAttribute('href');
		expect(href).toBeTruthy();
		const id = href!.slice(1);

		const targetHeading = page.locator(`[id="${id}"]`);
		await expect(targetHeading).toBeVisible();

		// Scroll heading to the top of the viewport
		await targetHeading.evaluate((el) => el.scrollIntoView({ block: 'start' }));

		// Wait for URL hash tracking to trigger and match
		const encodedId = encodeURIComponent(decodeURIComponent(id));
		await expect(page).toHaveURL(new RegExp('.*#' + encodedId));

		// The matching link in ToC should be highlighted (bold/underline)
		await expect(headingLink).toHaveClass(/underline/);
	});

	test('automatically scrolls to section and highlights in ToC on visit', async ({ page }) => {
		// First visit without hash to dynamically fetch the first heading's hash
		await page.route('**/utteranc.es/**', (route) => route.abort());
		await page.goto('/blog/11-다시-git-hub-pages로-블로그-배포하기');

		const toc = page.getByTestId('toc').and(page.locator(':visible')).first();
		await expect(toc).toBeVisible();

		// Hover to expand the floating ToC so links become visible
		await toc.hover();

		const headingLink = toc.locator('a[href^="#"]').first();
		const targetHash = await headingLink.getAttribute('href');
		expect(targetHash).toBeTruthy();

		// Now visit the page directly with the anchor hash
		await page.goto(`/blog/11-다시-git-hub-pages로-블로그-배포하기${targetHash}`);

		// Hover to expand the floating ToC so links become visible
		const toc2 = page.getByTestId('toc').and(page.locator(':visible')).first();
		await expect(toc2).toBeVisible();
		await toc2.hover();

		// Locate the heading link in ToC and assert it has highlighted style
		const activeHeadingLink = page
			.getByTestId('toc')
			.and(page.locator(':visible'))
			.locator(`a[href="${targetHash}"]`)
			.first();
		await expect(activeHeadingLink).toBeVisible();
		await expect(activeHeadingLink).toHaveClass(/underline/);

		// Assert we scrolled past the top (window.scrollY > 0)
		const scrollY = await page.evaluate(() => window.scrollY);
		expect(scrollY).toBeGreaterThan(100);
	});
});
