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

it('has a link to home', async () => {
	expect(await sidebar.getByRole('link', { name: 'Home' }).getAttribute('href')).toEqual('/');
});

it('has a link to about', async () => {
	expect(await sidebar.getByRole('link', { name: 'About' }).getAttribute('href')).toEqual('/about');
});

it('has a link to blog', async () => {
	expect(await sidebar.getByRole('link', { name: 'Blog' }).getAttribute('href')).toEqual('/blog');
});

it('has a search bar', async () => {
	await expect(sidebar.getByTestId('search')).toBeVisible();
});
