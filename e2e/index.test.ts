import { expect, test, type Page } from '@playwright/test';

const { beforeAll } = test;
const it = test;

let page: Page;

beforeAll('go to index page', async ({ browser }) => {
	page = await browser.newPage();
	await page.goto('/');
});

it('has a layout', async () => {
	await expect(page.getByTestId('layout')).toBeVisible();
});
