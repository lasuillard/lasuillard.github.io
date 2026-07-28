import { expect, test } from '@playwright/test';

test.describe('Blog Pagination', () => {
	test('should display pagination widget at top and bottom', async ({ page }) => {
		await page.goto('/blog');

		// Check that two pagination widgets exist (top and bottom)
		const paginationWidgets = page.locator('[data-testid="pagination"]');
		await expect(paginationWidgets).toHaveCount(2);
	});

	test('should show exactly 10 posts on the first page', async ({ page }) => {
		await page.goto('/blog');

		// The list of posts container is inside [data-testid="posts"]
		const posts = page.locator('[data-testid="posts"] > div.flex-col > div');
		await expect(posts).toHaveCount(10);
	});

	test('should navigate to the second page and show 1 post', async ({ page }) => {
		await page.goto('/blog');

		// Click the link to page 2 on the bottom pagination widget
		const page2Links = page.locator('[data-testid="pagination"] a:has-text("2")');
		// There are two pagination widgets, click the first one
		await page2Links.first().click();

		// Check URL changed to include page=2
		await expect(page).toHaveURL(/\/blog\?page=2/);

		// Check that the second page has exactly 1 post
		const posts = page.locator('[data-testid="posts"] > div.flex-col > div');
		await expect(posts).toHaveCount(1);
	});

	test('should handle previous and next navigation', async ({ page }) => {
		await page.goto('/blog?page=2');

		// Go back to page 1 using the previous button
		const prevButtons = page.locator('[data-testid="pagination"] [aria-label="Previous page"]');
		await prevButtons.first().click();

		await expect(page).toHaveURL(/\/blog\?page=1/);
		const posts = page.locator('[data-testid="posts"] > div.flex-col > div');
		await expect(posts).toHaveCount(10);
	});
});
