import { expect, test, type Page } from '@playwright/test';

const { beforeAll } = test;
const it = test;

let page: Page;

beforeAll('go to index page', async ({ browser }) => {
	page = await browser.newPage();
	await page.goto('/');
});

// TODO: This should be common test case for all routes
it('has a layout', async () => {
	await expect(page.getByTestId('layout')).toBeVisible();
});
