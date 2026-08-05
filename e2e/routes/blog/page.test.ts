import { expect, test } from '@playwright/test';

test.describe('Blog Pagination', () => {
	test('should display pagination widget at top and bottom with distinct testids', async ({
		page
	}) => {
		await page.goto('/blog');

		// Check that top and bottom pagination widgets exist and are distinct
		await expect(page.locator('[data-testid="pagination-top"]')).toBeVisible();
		await expect(page.locator('[data-testid="pagination-bottom"]')).toBeVisible();
	});

	test('should show exactly 5 posts on the first page', async ({ page }) => {
		await page.goto('/blog');

		// Retrieve all posts count dynamically
		const response = await page.request.get('/api/posts');
		const allPosts = await response.json();
		const expectedPage1Count = Math.min(allPosts.length, 5);

		// The list of posts has data-testid="post-item"
		const posts = page.locator('[data-testid="post-item"]');
		await expect(posts).toHaveCount(expectedPage1Count);
	});

	test('should navigate to the second page dynamically and show correct post counts', async ({
		page
	}) => {
		await page.goto('/blog');

		// Retrieve total posts dynamically to compute expected page 2 count
		const response = await page.request.get('/api/posts');
		const allPosts = await response.json();
		const totalPosts = allPosts.length;

		if (totalPosts > 5) {
			const expectedPage2Count = Math.min(totalPosts - 5, 5);

			// Click the link to page 2 on the bottom pagination widget
			const page2Links = page.locator('[data-testid="pagination-bottom"] a:has-text("2")');
			await page2Links.first().click();

			// Check URL changed to include page=2
			await expect(page).toHaveURL(/\/blog\?page=2/);

			// Check that the second page has correct dynamic count of posts
			const posts = page.locator('[data-testid="post-item"]');
			await expect(posts).toHaveCount(expectedPage2Count);
		}
	});

	test('should handle previous and next navigation', async ({ page }) => {
		// Retrieve total posts dynamically
		const response = await page.request.get('/api/posts');
		const allPosts = await response.json();
		const totalPosts = allPosts.length;

		if (totalPosts > 5) {
			await page.goto('/blog?page=2');

			// Go back to page 1 using the previous button
			const prevButtons = page.locator(
				'[data-testid="pagination-bottom"] [aria-label="Previous page"]'
			);
			await prevButtons.first().click();

			await expect(page).toHaveURL(/\/blog\?page=1/);
			const posts = page.locator('[data-testid="post-item"]');
			await expect(posts).toHaveCount(Math.min(totalPosts, 5));
		}
	});

	test('should prompt and navigate to specific page when clicking ellipsis (...)', async ({
		page
	}) => {
		// Set up a listener to automatically accept the prompt dialog with "2"
		page.on('dialog', async (dialog) => {
			expect(dialog.type()).toBe('prompt');
			await dialog.accept('2');
		});

		await page.goto('/blog');

		// Find and click the ellipsis (...) button on the bottom pagination widget
		const ellipsisBtn = page.locator(
			'[data-testid="pagination-bottom"] button[aria-label="Go to page"]'
		);
		if (await ellipsisBtn.isVisible()) {
			await ellipsisBtn.first().click();
			await expect(page).toHaveURL(/\/blog\?page=2/);
		}
	});
});
