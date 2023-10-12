import { expect, test, type Locator, type Page } from '@playwright/test';

const { beforeAll, fixme } = test;
const it = test;

let page: Page;
let searchBar: Locator;

beforeAll('go to index page', async ({ browser }) => {
	page = await browser.newPage();
	await page.goto('/');
	const header = page.locator('header').locator('visible = true');
	searchBar = header.getByTestId('search');
	await expect(searchBar).toBeVisible();
});

it('todo', () => fixme());
