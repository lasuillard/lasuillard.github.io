import { expect, test, type Locator, type Page } from '@playwright/test';

const { beforeAll, fixme } = test;
const it = test;

let page: Page;
let languageSelect: Locator;

beforeAll('go to index page', async ({ browser }) => {
	page = await browser.newPage();
	await page.goto('/');
	languageSelect = page.getByTestId('language-select');
	await expect(languageSelect).toBeVisible();
});

it('todo', () => fixme());
