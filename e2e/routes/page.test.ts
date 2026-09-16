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

		const qrCodeInDrawer = _page.locator('.drawer-side').getByTestId('qrcode');
		await expect(qrCodeInDrawer).toBeVisible();
	}
});

test('list all tags with ref counts', () => test.fixme());

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

	test('QR code feature', async ({ page }, testInfo) => {
		await page.goto('/');
		if (testInfo.project.name !== 'Mobile L') {
			const qrDropdown = page.getByTestId('qr-dropdown');
			await page.getByLabel('QR Code').click();
			await expect(page.getByTestId('qrcode')).toBeVisible();

			// Wait for opening transition to complete
			await page.waitForTimeout(350);

			const content = qrDropdown.locator('.dropdown-content');
			await expect(content).toHaveScreenshot('qrcode-dropdown.png', {
				// Mask dynamic canvas and URL to avoid diffs from ephemeral test server ports
				mask: [content.getByTestId('qrcode'), content.locator('span.select-all')]
			});
		} else {
			const drawerToggle = page.getByTestId('drawer-toggle');
			await drawerToggle.click();

			const qrCodeInDrawer = page.locator('.drawer-side').getByTestId('qrcode');
			await expect(qrCodeInDrawer).toBeVisible();

			// Wait for drawer slide-in transition to complete
			await page.waitForTimeout(350);

			const drawerContent = page.locator('.drawer-side .m-auto');
			await expect(drawerContent).toHaveScreenshot('qrcode-drawer.png', {
				// Mask dynamic canvas and URL to avoid diffs from ephemeral test server ports
				mask: [qrCodeInDrawer, page.locator('.drawer-side').locator('span.select-all')]
			});
		}
	});
});
