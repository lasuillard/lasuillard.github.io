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

it('has header, sidebar, main and footer @layout @header @sidebar @main @footer', async () => {
	await expect(layout.getByTestId('header')).toBeVisible();
	await expect(layout.getByTestId('sidebar')).toBeVisible();
	await expect(layout.getByTestId('main')).toBeVisible();
	await expect(layout.getByTestId('footer')).toBeVisible();
});

it('sidebar can be hidden with button in the header @layout @header @sidebar', async () => {
	await expect(layout.getByTestId('sidebar')).toBeVisible();
	await layout.getByTestId('sidebar-toggle').click();
	await expect(layout.getByTestId('sidebar')).not.toBeVisible();
	await layout.getByTestId('sidebar-toggle').click();
	await expect(layout.getByTestId('sidebar')).toBeVisible();
});
