import { expect, test, type Locator, type Page } from '@playwright/test';

const { beforeAll } = test;
const it = test;

let page: Page;
let layout: Locator;

beforeAll('go to index page', async ({ browser }) => {
	page = await browser.newPage();
	await page.goto('/');
	layout = page.getByTestId('layout');
	await expect(layout).toBeVisible();
});

it('has a header', async () => {
	await expect(layout.locator('header >> visible = true')).toBeVisible();
});

it('has a sidebar', async () => {
	await expect(layout.getByTestId('sidebar')).toBeVisible();
});

it('has a footer', async () => {
	await expect(layout.getByTestId('footer')).toBeVisible();
});
