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
		await page.goto('/blog/2-개발을-위한-데이터베이스');
		const widget = page.getByTestId('series-widget');
		await expect(widget).not.toBeVisible();
	});

	test('renders series widget with correct details and sorting on post 11', async () => {
		await page.goto('/blog/11-다시-git-hub-pages로-블로그-배포하기');
		const widget = page.getByTestId('series-widget');
		await expect(widget).toBeVisible();

		// Check series name
		await expect(widget.locator('h3')).toContainText('기술 블로그 운영하기');

		// Check sorted posts
		const listItems = widget.locator('ul > li');
		await expect(listItems).toHaveCount(3);

		// First item should be Post 11 (more recent, 2026-07-28)
		const firstItem = listItems.nth(0);
		await expect(firstItem).toContainText('다시 GitHub Pages로 블로그 배포하기');
		await expect(firstItem).toContainText('Current');

		// Second item should be Post 6 (2025-10-10)
		const secondItem = listItems.nth(1);
		await expect(secondItem).toContainText('Django로 블로그 다시 만들기');
		await expect(secondItem.locator('a')).toBeVisible();

		// Third item should be Post 1 (2023-11-03)
		const thirdItem = listItems.nth(2);
		await expect(thirdItem).toContainText('기술 블로그 시작하기');
		await expect(thirdItem.locator('a')).toBeVisible();
	});

	test('navigates via series widget and updates active state on post 6', async () => {
		await page.goto('/blog/11-다시-git-hub-pages로-블로그-배포하기');
		const widget = page.getByTestId('series-widget');
		const secondItemLink = widget.locator('ul > li').nth(1).locator('a');

		// Click the link to navigate to Post 6
		await secondItemLink.click();
		await page.waitForURL('**/blog/6-*');

		// Wait for the old page/widget to detach/disappear completely
		await expect(page.getByTestId('series-widget')).toHaveCount(1);

		// On Post 6, the series widget should also be visible
		const newWidget = page.getByTestId('series-widget');
		await expect(newWidget).toBeVisible();

		const listItems = newWidget.locator('ul > li');
		await expect(listItems).toHaveCount(3);

		// Post 11 (first item) should have an active link
		const firstItem = listItems.nth(0);
		await expect(firstItem).toContainText('다시 GitHub Pages로 블로그 배포하기');
		await expect(firstItem.locator('a')).toBeVisible();

		// Post 6 (second item) should be Current
		const secondItem = listItems.nth(1);
		await expect(secondItem).toContainText('Django로 블로그 다시 만들기');
		await expect(secondItem).toContainText('Current');

		// Post 1 (third item) should have an active link
		const thirdItem = listItems.nth(2);
		await expect(thirdItem).toContainText('기술 블로그 시작하기');
		await expect(thirdItem.locator('a')).toBeVisible();
	});
});
