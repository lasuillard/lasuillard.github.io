import { expect, test, type Page } from '@playwright/test';

let page: Page;

test.beforeAll('go to post page', async ({ browser }) => {
	page = await browser.newPage();
	await page.goto('/blog/1-기술-블로그-시작하기');

	// Block utterances widget and myhits badge from loading to prevent flakiness
	await page.route('**/utteranc.es/**', (route) => route.abort());
	await page.route('**/myhits.vercel.app/**', (route) => route.abort());
});

test('visit page', async () => {
	await page.waitForTimeout(2000);
	await expect(page).toHaveScreenshot({
		fullPage: true,
		mask: [page.locator("img[src$='.gif']"), page.locator('img[alt="hits"]')]
	});
});

test('has a title and meta tags for SEO', async () => {
	expect(await page.title()).toMatch(/.+ • lasuillard's Blog/);
	expect(await page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy();
});
