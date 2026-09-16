import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Helper to capture a locator screenshot with surrounding padding.
 *
 * Locator screenshots in Playwright crop tightly to the bounding box of the element.
 * This helper calculates an expanded clip region (with viewport boundary clamping)
 * to provide breathing room around floating elements, shadows, and rounded borders
 * for easier visual inspection and review.
 * @param targetPage - The Playwright Page instance.
 * @param locator - The element locator to capture.
 * @param name - Snapshot filename.
 * @param padding - Padding in pixels around the element.
 */
export async function expectScreenshotWithPadding(
	targetPage: Page,
	locator: Locator,
	name: string,
	padding = 24
) {
	const box = await locator.boundingBox();
	if (!box) throw new Error(`Bounding box not found for ${name}`);
	const viewport = targetPage.viewportSize();
	const x = Math.floor(Math.max(0, box.x - padding));
	const y = Math.floor(Math.max(0, box.y - padding));
	const width = Math.ceil(
		viewport
			? Math.min(viewport.width - x, box.width + (box.x - x) + padding)
			: box.width + padding * 2
	);
	const height = Math.ceil(box.height + (box.y - y) + padding);

	await expect(targetPage).toHaveScreenshot(name, {
		clip: { x, y, width, height }
	});
}
