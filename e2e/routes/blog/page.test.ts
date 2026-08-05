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

test.describe('Blog Tag Filtering', () => {
	test('visit blog page and filter by tag', async ({ page }) => {
		await page.goto('/blog');

		// Expect title to be the default "Blog" title
		await expect(page).toHaveTitle(/Blog • lasuillard's Blog/);

		// Get the tag span badge directly by filtering on text content
		const svelteKitSpan = page
			.locator('[data-testid="tags"] span')
			.filter({ hasText: 'SvelteKit' });
		await expect(svelteKitSpan).toBeVisible();

		// Check that the tag badge initially has badge-secondary and not badge-primary
		await expect(svelteKitSpan).toHaveClass(/badge-secondary/);
		await expect(svelteKitSpan).not.toHaveClass(/badge-primary/);

		// Locate the anchor link inside the span
		const svelteKitTag = svelteKitSpan.locator('a');

		// Click the tag to filter
		await svelteKitTag.click();

		// Expect the URL to change to include the query parameter
		await expect(page).toHaveURL(/\/blog\?tag=SvelteKit/);

		// Expect title to dynamically change
		await expect(page).toHaveTitle(/Blog • lasuillard's Blog/);

		// Expect the selected tag badge to be highlighted with badge-primary
		await expect(svelteKitSpan).toHaveClass(/badge-primary/);
		await expect(svelteKitSpan).not.toHaveClass(/badge-secondary/);

		// Click the tag again to clear/toggle the filter
		await svelteKitTag.click();

		// Expect the URL to go back to /blog without query parameter
		await expect(page).toHaveURL(/\/blog$/);

		// Expect title to return to default
		await expect(page).toHaveTitle(/Blog • lasuillard's Blog/);

		// Expect badge to return to badge-secondary
		await expect(svelteKitSpan).toHaveClass(/badge-secondary/);
		await expect(svelteKitSpan).not.toHaveClass(/badge-primary/);
	});

	test('should preserve tag filter when navigating pages', async ({ page }) => {
		await page.goto('/blog?tag=SvelteKit');

		// The pagination widget should be present
		const paginationWidgets = page.locator('[data-testid="pagination"]');
		await expect(paginationWidgets).toHaveCount(2);

		// Check that the link to page 1 preserves the tag
		const page1Links = page.locator('[data-testid="pagination"] a:has-text("1")');

		// Ensure the href contains tag=SvelteKit and page=1
		const href = await page1Links.first().getAttribute('href');
		expect(href).toMatch(/tag=SvelteKit/);
		expect(href).toMatch(/page=1/);
	});
});
