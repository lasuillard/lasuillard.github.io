import { expect, test, type Locator, type Page } from '@playwright/test';

const { beforeAll } = test;
const it = test;

let page: Page;
let sidebar: Locator;

beforeAll('go to index page', async ({ browser }) => {
	page = await browser.newPage();
	await page.goto('/');
	sidebar = page.getByTestId('sidebar');
	await expect(sidebar).toBeVisible();
});

it('has a profile', async () => {
	await expect(sidebar.getByTestId('profile')).toBeVisible();
});
