import { expect, test, type Page } from '@playwright/test';

let page: Page;

test.beforeAll('go to blog index page', async ({ browser }) => {
	page = await browser.newPage();
	await page.goto('/');
});

test('visit page', async () => {
	await expect(page).toHaveScreenshot({ fullPage: true });
});

test('has a title and meta tags for SEO', async () => {
	expect(await page.title()).toMatch(/.+ • lasuillard's Blog/);
	expect(await page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy();
});

test('renders recent posts section with 3 to 5 posts', async () => {
	const recentPostsSection = page.getByTestId('recent-posts');
	await expect(recentPostsSection).toBeVisible();

	const heading = recentPostsSection.locator('h3');
	await expect(heading).toHaveText('최근 게시글');

	const postCount = await recentPostsSection.locator('h4').count();
	expect(postCount).toBeGreaterThanOrEqual(3);
	expect(postCount).toBeLessThanOrEqual(5);
});

test('list all tags with ref counts', () => test.fixme());
