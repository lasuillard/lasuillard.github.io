import { expect, test, type Page } from '@playwright/test';

let page: Page;

test.beforeAll('go to blog index page', async ({ browser }) => {
	page = await browser.newPage();
	await page.goto('/');
});

test('visit page', async () => {
	await expect(page).toHaveScreenshot({ fullPage: true });
});

test('has a title and meta tags for SEO', async () => {
	expect(await page.title()).toMatch(/.+ • lasuillard's Blog/);
	expect(await page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy();
});

test('list all tags with ref counts', () => test.fixme());
