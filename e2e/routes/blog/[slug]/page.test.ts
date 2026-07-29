import { expect, test, type Page } from '@playwright/test';

let page: Page;

test.beforeAll('go to post page', async ({ browser }) => {
	page = await browser.newPage();
	await page.goto('/blog/1-기술-블로그-시작하기');

	// Block utterances widget from loading to prevent flakiness
	await page.route('**/utteranc.es/**', (route) => route.abort());
});

test('visit page', async () => {
	await expect(page).toHaveScreenshot({
		fullPage: true,
		mask: [page.locator("img[src$='.gif']")]
	});
});

test('has a title and meta tags for SEO', async () => {
	expect(await page.title()).toMatch(/.+ • lasuillard's Blog/);
	expect(await page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy();
});

test.describe('Series widget', () => {
	test('does not render series widget for post without a series', async () => {
		const widget = page.getByTestId('series-widget');
		await expect(widget).not.toBeVisible();
	});

	test('renders series widget with correct details and sorting on post 12', async () => {
		await page.goto('/blog/12-test-post-a');
		const widget = page.getByTestId('series-widget');
		await expect(widget).toBeVisible();

		// Check series name
		await expect(widget.locator('h3')).toContainText('Series: Test Series');

		// Check sorted posts
		const listItems = widget.locator('ul > li');
		await expect(listItems).toHaveCount(2);

		// First item should be Post 13 (more recent, Jan 2, 2026)
		const firstItem = listItems.nth(0);
		await expect(firstItem).toContainText('Test Post B');
		await expect(firstItem.locator('a')).toBeVisible();

		// Second item should be Post 12 (current, Jan 1, 2026)
		const secondItem = listItems.nth(1);
		await expect(secondItem).toContainText('Test Post A');
		await expect(secondItem).toContainText('Current');
	});

	test('navigates via series widget and updates active state on post 13', async () => {
		await page.goto('/blog/12-test-post-a');
		const widget = page.getByTestId('series-widget');
		const firstItemLink = widget.locator('ul > li').nth(0).locator('a');

		// Click the link to navigate to Post 13
		await firstItemLink.click();
		await page.waitForURL('**/blog/13-test-post-b**');

		// Wait for the old page/widget to detach/disappear completely
		await expect(page.getByTestId('series-widget')).toHaveCount(1);

		// On Post 13, the series widget should also be visible
		const newWidget = page.getByTestId('series-widget');
		await expect(newWidget).toBeVisible();

		const listItems = newWidget.locator('ul > li');
		await expect(listItems).toHaveCount(2);

		// Now Post 13 (first item) should be Current
		const firstItem = listItems.nth(0);
		await expect(firstItem).toContainText('Test Post B');
		await expect(firstItem).toContainText('Current');

		// Post 12 (second item) should have an active link
		const secondItem = listItems.nth(1);
		await expect(secondItem).toContainText('Test Post A');
		await expect(secondItem.locator('a')).toBeVisible();
	});
});
