import { expect, test, type Locator, type Page } from '@playwright/test';

const { beforeAll, fixme } = test;
const it = test;

let page: Page;
let searchBar: Locator;

beforeAll('go to index page', async ({ browser }) => {
	page = await browser.newPage();
	await page.goto('/');
	const sidebar = page.getByTestId('sidebar');
	searchBar = sidebar.getByTestId('search');
	await expect(searchBar).toBeVisible();
});

it('result window shows if text input focused @search', async () => {
	// Search results shouldn't visible at first
	const results = page.getByRole('searchbox');
	await expect(results).toBeHidden();

	// If focuses input, results should shown (even empty)
	await searchBar.getByRole('textbox').focus();
	await expect(results).toBeVisible();
	await expect(results).toHaveText(/No results found/, { ignoreCase: true });
});

// TODO: It may change as new post created, so need better way of handling it (test fixtures)
it('suggest alternatives', () => fixme());

it('search and get result @search', async () => {
	await searchBar.getByRole('textbox').fill('lorem');

	// Returns at least one result
	const firstResult = page.getByRole('searchbox').getByRole('link').nth(0);
	await expect(firstResult).toBeVisible();
	await firstResult.click();

	// Follow link
	await expect(page).toHaveURL(/^.*\/blog\/.+$/);
	await expect(page.getByText('404 Not Found')).not.toBeVisible();
});
