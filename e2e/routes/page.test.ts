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

test('renders recent posts section with 3 posts', async () => {
	const recentPostsSection = page.getByTestId('recent-posts');
	await expect(recentPostsSection).toBeVisible();

	const heading = recentPostsSection.locator('h3');
	await expect(heading).toHaveText('최근 쓴 글');

	const postCount = await recentPostsSection.locator('h2.card-title').count();
	expect(postCount).toBe(3);
});

test('header has QR code dropdown on desktop', async ({ page: _page }, testInfo) => {
	await _page.goto('/');
	const qrDropdown = _page.getByLabel('QR Code');

	if (testInfo.project.name !== 'Mobile L') {
		await expect(qrDropdown).toBeVisible();

		await qrDropdown.click();
		await expect(_page.getByTestId('qrcode')).toBeVisible();
	} else {
		await expect(qrDropdown).not.toBeVisible();
	}
});

test('header has QR code inside drawer on mobile', async ({ page: _page }, testInfo) => {
	await _page.goto('/');
	if (testInfo.project.name === 'Mobile L') {
		const drawerToggle = _page.getByTestId('drawer-toggle');
		await expect(drawerToggle).toBeVisible();

		await drawerToggle.click();

		const qrCodeInDrawer = _page.locator('.drawer-side [data-testid="qrcode"]');
		await expect(qrCodeInDrawer).toBeVisible();
	}
});

test('list all tags with ref counts', () => test.fixme());
