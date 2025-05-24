import { expect, test, type Page } from '@playwright/test';

const { beforeAll } = test;
const it = test;

let page: Page;

beforeAll('go to post page', async ({ browser }) => {
	page = await browser.newPage();
	await page.goto('/blog/기술-블로그-시작하기');
});

it('visit page', async () => {
	await expect(page).toHaveScreenshot();
});

it('has a title and meta tags for SEO', async () => {
	expect(await page.title()).toMatch(/.+ • lasuillard's Blog/);
	expect(page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy();
});
