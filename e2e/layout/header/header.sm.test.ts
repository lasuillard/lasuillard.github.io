import { expect, test, type Locator, type Page } from '@playwright/test';

const { beforeAll } = test;
const it = test;

let page: Page;
let header: Locator;
let menu: Locator;

beforeAll('go to index page', async ({ browser }) => {
	page = await browser.newPage();
	await page.goto('/');
	header = page.locator('header').locator('visible = true');
	menu = header.locator('label'); // FIXME: Better locator?
});

it('has a link to home', async () => {
	await menu.getByRole('img').click();
	expect(await header.getByRole('link', { name: 'Home' }).getAttribute('href')).toEqual('/');
	await header.click();
});

it('has a link to about', async () => {
	await menu.getByRole('img').click();
	expect(await header.getByRole('link', { name: 'About' }).getAttribute('href')).toEqual('/about');
	await header.click();
});

it('has a link to blog', async () => {
	await menu.getByRole('img').click();
	expect(await header.getByRole('link', { name: 'Blog' }).getAttribute('href')).toEqual('/blog');
	await header.click();
});

// Responsive headers mutually exclusive
it('has a search bar', async () => {
	await menu.getByRole('img').click();
	await expect(header.getByTestId('search')).toBeVisible();
	await header.click();
});

it('has a theme select', async () => {
	await expect(header.getByTestId('theme-select')).toBeVisible();
});

it('has a language select', async () => {
	await expect(header.getByTestId('language-select')).toBeVisible();
});
