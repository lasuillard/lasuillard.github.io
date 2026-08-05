import { expect, test } from '@playwright/test';

test('visit blog page and filter by tag', async ({ page }) => {
	await page.goto('/blog');

	// Expect title to be the default "Blog" title
	await expect(page).toHaveTitle(/Blog • lasuillard's Blog/);

	// Get the tag span badge directly by filtering on text content
	const svelteKitSpan = page.locator('[data-testid="tags"] span').filter({ hasText: 'SvelteKit' });
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
