// @vitest-environment happy-dom
import ChangelogWidget from '$routes/blog/[slug]/ChangelogWidget.svelte';
import { render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('ChangelogWidget', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-03-20T12:00:00+09:00'));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('renders changelog entries in descending chronological order using testids', () => {
		const changelogs = [
			{ date: new Date('2025-01-10T12:00:00+09:00'), message: '첫 번째 변경' },
			{ date: new Date('2026-03-15T12:00:00+09:00'), message: '세 번째 변경' },
			{ date: new Date('2025-06-20T12:00:00+09:00'), message: '두 번째 변경' }
		];

		const { getByTestId, getAllByTestId } = render(ChangelogWidget, { changelogs });

		const widget = getByTestId('changelog-widget');
		expect(widget).toBeTruthy();
		// Starts closed by default
		expect(widget.hasAttribute('open')).toBe(false);

		// Header assertions: anchored date is 2026-03-20, latest changelog is 2026-03-15 (5일 전)
		expect(getByTestId('changelog-title').textContent?.trim()).toBe('변경 이력');
		expect(getByTestId('changelog-latest-date').textContent?.trim()).toBe('5일 전');
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
		const changelogs = [{ date: new Date('2026-03-18T12:00:00+09:00'), message: '단일 업데이트' }];

		const { getByTestId, getAllByTestId } = render(ChangelogWidget, { changelogs });

		// 2026-03-20 vs 2026-03-18 -> 2일 전
		expect(getByTestId('changelog-title').textContent?.trim()).toBe('변경 이력');
		expect(getByTestId('changelog-latest-date').textContent?.trim()).toBe('2일 전');

		const items = getAllByTestId('changelog-item');
		expect(items).toHaveLength(1);
		expect(getByTestId('changelog-item-date').textContent?.trim()).toBe('2026-03-18');
		expect(getByTestId('changelog-message').textContent?.trim()).toBe('단일 업데이트');
		expect(getByTestId('changelog-latest-badge')).toBeTruthy();
	});

	it('displays "오늘" when the latest changelog was posted today', () => {
		const changelogs = [{ date: new Date('2026-03-20T12:00:00+09:00'), message: '오늘 업데이트' }];

		const { getByTestId } = render(ChangelogWidget, { changelogs });
		expect(getByTestId('changelog-latest-date').textContent?.trim()).toBe('오늘');
	});
});
