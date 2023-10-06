import { expect, test, type Locator, type Page } from '@playwright/test';

const { beforeAll } = test;
const it = test;

let page: Page;
let header: Locator;

beforeAll('go to index page', async ({ browser }) => {
	page = await browser.newPage();
	await page.goto('/');
	header = page.getByTestId('header');
	await expect(header).toBeVisible();
});

it('has a link to home', async () => {
	const link = header.getByTestId('home-link');
	expect(await link.getByRole('link').getAttribute('href')).toEqual('/');
});

it('has a search bar', async () => {
	await expect(header.getByTestId('search')).toBeVisible();
});

it('has a theme select', async () => {
	await expect(header.getByTestId('theme-select')).toBeVisible();
});

it('has a language select', async () => {
	await expect(header.getByTestId('language-select')).toBeVisible();
});
