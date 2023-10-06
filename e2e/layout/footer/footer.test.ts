import { expect, test, type Locator, type Page } from '@playwright/test';

const { beforeAll, fixme } = test;
const it = test;

let page: Page;
let footer: Locator;

beforeAll('go to index page', async ({ browser }) => {
	page = await browser.newPage();
	await page.goto('/');
	footer = page.getByTestId('footer');
	await expect(footer).toBeVisible();
});

it('nothing to test yet', () => fixme());
