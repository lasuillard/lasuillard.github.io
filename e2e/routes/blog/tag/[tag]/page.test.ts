import { expect, test, type Page } from '@playwright/test';

const { beforeAll } = test;
const it = test;

let page: Page;

beforeAll('go to tag page', async ({ browser }) => {
	page = await browser.newPage();
	await page.goto('/blog/tag/Apple');
});

it('visit page', async () => {
	await expect(page).toHaveScreenshot();
});

it('has a title and meta tags for SEO', async () => {
	expect(await page.title()).toMatch(/.+ • lasuillard's Blog/);
	expect(await page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy();
});
