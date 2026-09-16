// @vitest-environment happy-dom
import ChangelogWidget from '$routes/blog/[slug]/ChangelogWidget.svelte';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

describe('ChangelogWidget', () => {
	it('renders changelog entries in descending chronological order using testids', () => {
		const changelogs = [
			{ date: new Date('2025-01-10'), message: '첫 번째 변경' },
			{ date: new Date('2026-03-15'), message: '세 번째 변경' },
			{ date: new Date('2025-06-20'), message: '두 번째 변경' }
		];

		const { getByTestId, getAllByTestId } = render(ChangelogWidget, { changelogs });

		const widget = getByTestId('changelog-widget');
		expect(widget).toBeTruthy();
		// Starts closed by default
		expect(widget.hasAttribute('open')).toBe(false);

		// Header assertions
		expect(getByTestId('changelog-title').textContent?.trim()).toBe('변경 이력');
		expect(getByTestId('changelog-latest-date').textContent?.trim()).toBe('2026-03-15');
		expect(getByTestId('heroicons/clock')).toBeTruthy();

		// Item assertions
		const items = getAllByTestId('changelog-item');
		expect(items).toHaveLength(3);

		const dates = getAllByTestId('changelog-item-date');
		expect(dates.map((d) => d.textContent?.trim())).toEqual([
			'2026-03-15',
			'2025-06-20',
			'2025-01-10'
		]);

		const messages = getAllByTestId('changelog-message');
		expect(messages.map((m) => m.textContent?.trim())).toEqual([
			'세 번째 변경',
			'두 번째 변경',
			'첫 번째 변경'
		]);

		// Latest badge should only be present in the first item
		const latestBadge = getByTestId('changelog-latest-badge');
		expect(latestBadge.textContent?.trim()).toBe('최신');
		expect(items[0].contains(latestBadge)).toBe(true);
		expect(items[1].querySelector('[data-testid="changelog-latest-badge"]')).toBeNull();
		expect(items[2].querySelector('[data-testid="changelog-latest-badge"]')).toBeNull();
	});

	it('renders a single changelog item correctly', () => {
		const changelogs = [{ date: new Date('2026-08-20'), message: '단일 업데이트' }];

		const { getByTestId, getAllByTestId } = render(ChangelogWidget, { changelogs });

		expect(getByTestId('changelog-title').textContent?.trim()).toBe('변경 이력');
		expect(getByTestId('changelog-latest-date').textContent?.trim()).toBe('2026-08-20');

		const items = getAllByTestId('changelog-item');
		expect(items).toHaveLength(1);
		expect(getByTestId('changelog-item-date').textContent?.trim()).toBe('2026-08-20');
		expect(getByTestId('changelog-message').textContent?.trim()).toBe('단일 업데이트');
		expect(getByTestId('changelog-latest-badge')).toBeTruthy();
	});
});
