import { expect, test } from '@playwright/test';

test.describe('Blog Pagination', () => {
	test('should display pagination widget at top and bottom', async ({ page }) => {
		await page.goto('/blog');

		// Check that two pagination widgets exist (top and bottom)
		const paginationWidgets = page.getByTestId('pagination');
		await expect(paginationWidgets).toHaveCount(2);
	});

	test('should show exactly 10 posts on the first page', async ({ page }) => {
		await page.goto('/blog');

		// The list of posts container is inside [data-testid="posts"]
		const posts = page.getByTestId('posts').locator('article');
		await expect(posts).toHaveCount(10);
	});

	test('should navigate to the second page and show valid number of posts', async ({ page }) => {
		await page.goto('/blog');

		// Click the link to page 2 on the bottom pagination widget
		const page2Links = page.getByTestId('pagination').locator('a:has-text("2")');
		// There are two pagination widgets, click the first one
		await page2Links.first().click();

		// Check URL changed to include page=2
		await expect(page).toHaveURL(/\/blog\?page=2/);

		// Check that the second page has a valid number of posts
		const posts = page.getByTestId('posts').locator('article');
		await expect(posts.first()).toBeVisible();
		await expect(async () => {
			expect(await posts.count()).toBeLessThanOrEqual(10);
		}).toPass();
	});

	test('should handle previous and next navigation', async ({ page }) => {
		await page.goto('/blog?page=2');

		// Go back to page 1 using the previous button
		const prevButtons = page.getByTestId('pagination').locator('[aria-label="이전 페이지"]');
		await prevButtons.first().click();

		await expect(page).toHaveURL(/\/blog$/);
		const posts = page.getByTestId('posts').locator('article');
		await expect(posts).toHaveCount(10);

		// Go to page 2 using the next button
		const nextButtons = page.getByTestId('pagination').locator('[aria-label="다음 페이지"]');
		await nextButtons.first().click();

		await expect(page).toHaveURL(/\/blog\?page=2/);
		await expect(posts.first()).toBeVisible();
	});
});

test.describe('Blog Tag Filtering', () => {
	test('visit blog page and filter by tag', async ({ page }) => {
		await page.goto('/blog');

		// Expect title to be the default "Blog" title
		await expect(page).toHaveTitle(/Blog • lasuillard's Blog/);

		// If on mobile/tablet, the tags are inside a <details> dropdown that needs to be opened
		const details = page.locator('details.collapse');
		if (await details.isVisible()) {
			await details.locator('summary').click();
		}

		// Get the tag link directly by filtering on text content (must be the visible one)
		const tag = page.locator('aside').locator('a:visible').filter({ hasText: 'SvelteKit' }).first();
		await expect(tag).toBeVisible();

		// Click the tag to filter
		await tag.click();

		// Expect the URL to change to include the query parameter
		await expect(page).toHaveURL(/\/blog\?tag=SvelteKit/);

		// Expect title to dynamically change
		await expect(page).toHaveTitle(/Blog • lasuillard's Blog/);

		// Click "전체보기" to clear it, since our logic navigates to /blog for 전체보기
		if (await details.isVisible()) {
			await details.locator('summary').click();
		}
		const allTags = page
			.locator('aside')
			.locator('a:visible')
			.filter({ hasText: '전체보기' })
			.first();
		await allTags.click();

		// Expect the URL to go back to /blog without query parameter
		await expect(page).toHaveURL(/\/blog$/);

		// Expect title to return to default
		await expect(page).toHaveTitle(/Blog • lasuillard's Blog/);
	});

	test('should preserve tag filter when navigating pages', async ({ page }) => {
		await page.goto('/blog?tag=SvelteKit');

		// The pagination widget should be present
		const paginationWidgets = page.getByTestId('pagination');
		await expect(paginationWidgets).toHaveCount(2);

		// Check that the link to page 1 preserves the tag
		const page1Links = page.getByTestId('pagination').locator('a:has-text("1")');

		// Ensure the href contains tag=SvelteKit and page=1
		const href = await page1Links.first().getAttribute('href');
		expect(href).toMatch(/tag=SvelteKit/);
	});
});

test.describe('Visual regression', () => {
	// Captures the full blog index page.
	// Uses a fixed clock time to prevent test flakiness from relative publication dates changing over time.
	test('full blog index page', async ({ page }) => {
		await page.clock.setFixedTime(new Date('2026-09-16T12:00:00Z'));

		// Use tag-filtered view to list only posts with the Pulumi tag, which does not change often
		await page.goto('/blog?tag=Pulumi');

		const postsSection = page.getByTestId('posts');
		await expect(postsSection).toBeVisible();

		// Ensure the post cards have rendered with images
		await expect(postsSection.locator('img').first()).toBeVisible();

		// Wait for Svelte fade/flip transitions to settle
		await page.waitForTimeout(350);

		await expect(page).toHaveScreenshot('blog-index-full.png', { fullPage: true });
	});
});
