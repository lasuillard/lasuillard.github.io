import { expect, test, type Page } from '@playwright/test';

const { beforeAll, fixme } = test;
const it = test;

let page: Page;

beforeAll('go to blog index page', async ({ browser }) => {
	page = await browser.newPage();
	await page.goto('/');
});

it('has a layout', async () => {
	await expect(page.getByTestId('layout')).toBeVisible();
});

it('has a title and meta tags for SEO', async () => {
	expect(await page.title()).toMatch(/.+ • lasuillard's Blog/);
	expect(page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy();
});

it('list all tags with ref counts', () => fixme());
