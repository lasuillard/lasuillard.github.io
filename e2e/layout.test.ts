import { expect, test, type Locator, type Page } from '@playwright/test';

const { fixme, beforeAll, describe } = test;
const it = test;

let page: Page;
let layout: Locator;
let header: Locator;
let main: Locator;
let footer: Locator;

beforeAll('go to index page', async ({ browser }) => {
	page = await browser.newPage();
	await page.goto('/');
	layout = page.getByTestId('layout');
	header = layout.getByTestId('header');
	main = layout.getByTestId('main');
	footer = layout.getByTestId('footer');
});

it('has layout components @layout @header @main @footer', async () => {
	await expect(header).toBeVisible();
	await expect(main).toBeVisible();
	await expect(footer).toBeVisible();
});

describe('header @layout @header', () => {
	it('has a theme select', async () => {
		await expect(header.getByTestId('theme-select')).toBeVisible();
	});

	it('has a language select', async () => {
		await expect(header.getByTestId('language-select')).toBeHidden();
	});
});

describe('footer @layout @footer', () => {
	it('has copyright notice', async () => {
		const currentYear = new Date().getFullYear();
		const notice = footer.getByText(
			new RegExp(`([cC]opyright|©) (2023 - ${currentYear}) Yuchan Lee. All rights reserved.`)
		);
		await expect(notice).toBeVisible();
	});

	it('link to my GitHub profile is valid', async () => {
		await footer.getByTestId('icon/github').click();
		const popup = await page.waitForEvent('popup');
		await popup.waitForLoadState();
		expect(await popup.title()).toEqual('lasuillard (Yuchan Lee) · GitHub');
		await popup.close();
	});

	it('link to my LinkedIn profile is valid', async () => {
		return fixme();
	});

	it('mail to is valid', async () => {
		// FIXME: Test the behavior rather than attribute
		await expect(footer.getByRole('link', { name: 'Send an email to me' })).toHaveAttribute(
			'href',
			'mailto:lasuillard@gmail.com'
		);
	});

	it('has a valid link to RSS feeds', async () => {
		// FIXME: Parse & validate RSS feed
		await expect(footer.getByRole('link', { name: 'RSS feeds' })).toHaveAttribute(
			'href',
			'/rss.xml'
		);
	});
});
