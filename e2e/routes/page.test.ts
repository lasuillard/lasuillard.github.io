import { expect, test } from '@playwright/test';

test('visit page', async ({ page }) => {
	// Fix clock time to prevent relative date shifts over time
	await page.clock.setFixedTime(new Date('2026-09-16T12:00:00Z'));
	await page.goto('/');
	await expect(page).toHaveScreenshot({ fullPage: true });
});

test('has a title and meta tags for SEO', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveTitle(/.+ • lasuillard's Blog/);
	expect(await page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy();
});

test('renders recent posts section with 3 posts', async ({ page }) => {
	await page.goto('/');
	const recentPostsSection = page.getByTestId('recent-posts');
	await expect(recentPostsSection).toBeVisible();

	const heading = recentPostsSection.locator('h2').first();
	await expect(heading).toHaveText('최근 쓴 글');

	const postCount = await recentPostsSection.locator('article').count();
	expect(postCount).toBe(3);
});

test('persists theme selection across reloads', async ({ page }) => {
	await page.goto('/');
	const initialTheme = await page.locator('html').getAttribute('data-theme');
	const themeToggle = page.getByLabel('Theme Selection');
	await expect(themeToggle).toBeVisible();

	await themeToggle.click();
	const newTheme = await page.locator('html').getAttribute('data-theme');
	expect(newTheme).not.toBe(initialTheme);

	const storedTheme = await page.evaluate(() => localStorage.getItem('theme'));
	expect(storedTheme).toBe(JSON.stringify(newTheme));

	await page.reload();
	const reloadedTheme = await page.locator('html').getAttribute('data-theme');
	expect(reloadedTheme).toBe(newTheme);
});

test.describe('Visual regression', () => {
	test('search modal with query results', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: '검색' }).click();
		const modal = page.getByTestId('search-modal');
		await expect(modal).toBeVisible();

		const input = page.getByTestId('search-input');
		await input.fill('Playwright');
		await expect(page.getByTestId('search-results')).toBeVisible();

		await expect(modal).toHaveScreenshot('search-modal-results.png');
	});
});
