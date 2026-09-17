import { expect, type Locator, type Page } from '@playwright/test';

export interface BoundingBox {
	x: number;
	y: number;
	width: number;
	height: number;
}

/**
 * Calculates an enclosing bounding box that encompasses one or more locators.
 *
 * Each element is scrolled into view, aligned to the viewport if negative offset occurs,
 * and its coordinates are aggregated to form a minimal bounding box covering all elements.
 * @param locators - Single locator or array of locators to enclose.
 * @returns The bounding box spanning all provided locators.
 * @throws {Error} if locators array is empty or any locator bounding box is unavailable.
 */
export async function getUnionBoundingBox(locators: Locator | Locator[]): Promise<BoundingBox> {
	const locList = Array.isArray(locators) ? locators : [locators];
	if (locList.length === 0) {
		throw new Error('getUnionBoundingBox requires at least one Locator.');
	}

	// Gather document-space coordinates for all locators to find the topmost element
	const docPositions = await Promise.all(
		locList.map(async (loc) => {
			return await loc.evaluate((el) => {
				const rect = el.getBoundingClientRect();
				return {
					docY: rect.top + window.scrollY,
					docX: rect.left + window.scrollX
				};
			});
		})
	);

	// Align page scroll so the topmost element starts at the top of the viewport
	const minDocY = Math.min(...docPositions.map((p) => p.docY));
	const topmostIndex = docPositions.findIndex((p) => p.docY === minDocY);
	await locList[topmostIndex].evaluate((el) => {
		el.scrollIntoView({ block: 'start', behavior: 'instant' });
	});

	// Read viewport bounding boxes for all locators at the identical, synchronized scroll position
	const boxes: BoundingBox[] = [];
	for (const loc of locList) {
		const box = await loc.boundingBox();
		if (!box) {
			throw new Error('Unable to determine bounding box for locator.');
		}
		boxes.push(box);
	}

	// Aggregate coordinates to find the smallest bounding rectangle containing all boxes
	const minX = Math.min(...boxes.map((b) => b.x));
	const minY = Math.min(...boxes.map((b) => b.y));
	const maxX = Math.max(...boxes.map((b) => b.x + b.width));
	const maxY = Math.max(...boxes.map((b) => b.y + b.height));

	return {
		x: minX,
		y: minY,
		width: maxX - minX,
		height: maxY - minY
	};
}

/**
 * Calculates the expanded clip rectangle around a bounding box, applying surrounding padding
 * while keeping boundaries clamped to the current viewport dimensions.
 * @param box - The base bounding box coordinates.
 * @param viewport - The current viewport dimensions, if available.
 * @param padding - Padding in pixels around the element.
 * @returns The clipped rectangle dimensions clamped to the viewport.
 */
export function calculateClipRegion(
	box: BoundingBox,
	viewport: { width: number; height: number } | null,
	padding = 0
): BoundingBox {
	// Clamp origin to non-negative coordinates
	const x = Math.floor(Math.max(0, box.x - padding));
	const y = Math.floor(Math.max(0, box.y - padding));

	// Expand width and height with padding, clamping to viewport boundaries if available
	const width = Math.ceil(
		viewport
			? Math.min(viewport.width - x, box.width + (box.x - x) + padding)
			: box.width + padding * 2
	);
	const height = Math.ceil(
		viewport
			? Math.min(viewport.height - y, box.height + (box.y - y) + padding)
			: box.height + padding * 2
	);

	return { x, y, width, height };
}

/**
 * Temporarily hides a list of locators (setting `visibility: hidden`) for the duration
 * of an asynchronous action, guaranteeing that visibility is restored afterwards.
 * @param locators - Elements to temporarily hide.
 * @param action - Asynchronous callback to execute while elements are hidden.
 * @returns The result of the action callback.
 */
export async function withHiddenElements<T>(
	locators: Locator[] | undefined,
	action: () => Promise<T>
): Promise<T> {
	if (!locators || locators.length === 0) {
		return await action();
	}

	for (const loc of locators) {
		await loc
			.evaluate((el) => {
				el.style.visibility = 'hidden';
			})
			.catch(() => {});
	}

	try {
		return await action();
	} finally {
		for (const loc of locators) {
			await loc
				.evaluate((el) => {
					el.style.visibility = '';
				})
				.catch(() => {});
		}
	}
}

/**
 * Temporarily expands the page viewport height if the required height exceeds current viewport size,
 * ensuring the original viewport dimensions are restored afterwards.
 * @param page - Playwright Page instance.
 * @param requiredHeight - Minimum viewport height needed for snapshot.
 * @param action - Asynchronous callback to execute with the expanded viewport.
 * @returns The result of the action callback.
 */
export async function withExpandedViewport<T>(
	page: Page,
	requiredHeight: number,
	action: () => Promise<T>
): Promise<T> {
	const origViewport = page.viewportSize();

	if (origViewport && requiredHeight > origViewport.height) {
		await page.setViewportSize({
			width: origViewport.width,
			height: requiredHeight
		});

		try {
			return await action();
		} finally {
			await page.setViewportSize(origViewport);
		}
	}

	return await action();
}

/**
 * Helper to capture a screenshot of one or more locators with optional surrounding padding and hidden elements.
 *
 * Locator screenshots in Playwright crop tightly to element bounding boxes. This helper
 * expands the capture region with padding (e.g. for drop shadows and rounded corners), supports
 * multi-element bounding boxes, and temporarily hides interfering elements or expands viewport
 * height when needed.
 * @param page - The Playwright Page instance.
 * @param locator - The element locator or array of locators to capture.
 * @param name - Snapshot filename.
 * @param options - Optional configuration including padding, hidden elements, and Playwright screenshot options.
 * @param options.padding - Optional padding around the captured region.
 * @param options.hide - Array of locators to temporarily hide during the screenshot.
 */
export async function expectToHaveScreenshot(
	page: Page,
	locator: Locator | Locator[],
	name: string,
	options?: {
		padding?: number;
		hide?: Locator[];
	}
): Promise<void> {
	const { padding = 0, hide, ...screenshotOptions } = options ?? {};

	await withHiddenElements(hide, async () => {
		// Calculate the initial bounding box encompassing all target locators
		const box = await getUnionBoundingBox(locator);

		// Determine required viewport height to avoid vertical truncation from padding
		const origViewport = page.viewportSize();
		const requiredHeight = origViewport ? Math.ceil(box.y + box.height + padding + 10) : 0;

		// Temporarily expand the viewport height if the target bounding box extends beyond it
		await withExpandedViewport(page, requiredHeight, async () => {
			// Recalculate bounding box in case viewport expansion shifted layout
			const updatedBox = await getUnionBoundingBox(locator);
			const clip = calculateClipRegion(updatedBox, page.viewportSize(), padding);

			// Perform visual regression screenshot assertion with clipped boundaries
			await expect(page).toHaveScreenshot(name, {
				clip,
				...screenshotOptions
			});
		});
	});
}
