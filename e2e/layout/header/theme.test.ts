import { expect, test, type Locator, type Page } from '@playwright/test';

const { beforeAll, fixme } = test;
const it = test;

let page: Page;
let themeSelect: Locator;

beforeAll('go to index page', async ({ browser }) => {
	page = await browser.newPage();
	await page.goto('/');
	themeSelect = page.getByTestId('theme-select');
	await expect(themeSelect).toBeVisible();
});

it('todo', () => fixme());
