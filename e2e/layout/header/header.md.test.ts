import { expect, test, type Locator, type Page } from '@playwright/test';

const { beforeAll } = test;
const it = test;

let page: Page;
let header: Locator;

beforeAll('go to index page', async ({ browser }) => {
	page = await browser.newPage();
	await page.goto('/');
	header = page.locator('header').locator('visible = true');
});

it('has a link to home', async () => {
	expect(await header.getByRole('link', { name: 'Home' }).getAttribute('href')).toEqual('/');
});

it('has a link to about', async () => {
	expect(await header.getByRole('link', { name: 'About' }).getAttribute('href')).toEqual('/about');
});

it('has a link to blog', async () => {
	expect(await header.getByRole('link', { name: 'Blog' }).getAttribute('href')).toEqual('/blog');
});

it('has a theme select', async () => {
	await expect(header.getByTestId('theme-select')).toBeVisible();
});

it('has a language select', async () => {
	await expect(header.getByTestId('language-select')).toBeVisible();
});
