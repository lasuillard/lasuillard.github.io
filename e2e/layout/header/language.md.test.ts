import { expect, test, type Locator, type Page } from '@playwright/test';

const { beforeAll, fixme } = test;
const it = test;

let page: Page;
let languageSelect: Locator;

beforeAll('go to index page', async ({ browser }) => {
	page = await browser.newPage();
	await page.goto('/');
	const header = page.locator('header').locator('visible = true');
	languageSelect = header.getByTestId('language-select');
	await expect(languageSelect).toBeVisible();
});

it('todo', () => fixme());
