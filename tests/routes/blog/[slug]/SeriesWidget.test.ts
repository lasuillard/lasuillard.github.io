// @vitest-environment happy-dom
import type { Post } from '$lib/post';
import SeriesWidget from '$routes/blog/[slug]/SeriesWidget.svelte';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

describe('SeriesWidget', () => {
	const mockPosts: Post[] = [
		{
			metadata: {
				id: '1',
				slug: 'first-post',
				title: '첫 번째 글',
				publicationDate: new Date('2024-01-01T12:00:00+09:00'),
				preview: '/no-image.svg',
				summary: '첫 번째 글 요약',
				tags: []
			},
			content: '내용 1'
		},
		{
			metadata: {
				id: '2',
				slug: 'second-post',
				title: '두 번째 글',
				publicationDate: new Date('2024-06-01T12:00:00+09:00'),
				preview: '/no-image.svg',
				summary: '두 번째 글 요약',
				tags: []
			},
			content: '내용 2'
		},
		{
			metadata: {
				id: '3',
				slug: 'third-post',
				title: '세 번째 글',
				publicationDate: new Date('2024-03-01T12:00:00+09:00'),
				preview: '/no-image.svg',
				summary: '세 번째 글 요약',
				tags: []
			},
			content: '내용 3'
		}
	];

	it('renders series widget with sorted posts and current post highlighted', () => {
		const { getByTestId, getAllByTestId } = render(SeriesWidget, {
			seriesName: '테스트 시리즈',
			seriesPosts: mockPosts,
			currentPostId: '2'
		});

		const widget = getByTestId('series-widget');
		expect(widget).toBeTruthy();
		expect(widget.hasAttribute('open')).toBe(true);

		// Header
		expect(getByTestId('series-title').textContent?.trim()).toBe('테스트 시리즈');
		expect(getByTestId('series-count').textContent?.trim()).toBe('3개의 글');
		expect(getByTestId('heroicons/folder')).toBeTruthy();

		// Items sorted by publication date descending: 2 (June), 3 (March), 1 (January)
		const items = getAllByTestId('series-item');
		expect(items).toHaveLength(3);

		const dates = getAllByTestId('series-item-date');
		expect(dates).toHaveLength(3);
		expect(dates[0].textContent?.trim()).toBe('2024-06-01');
		expect(dates[1].textContent?.trim()).toBe('2024-03-01');
		expect(dates[2].textContent?.trim()).toBe('2024-01-01');

		// First item (id: 2, current)
		expect(items[0].textContent).toContain('두 번째 글');
		expect(items[0].textContent).toContain('현재');
		expect(getByTestId('series-current-badge').textContent?.trim()).toBe('현재');
		expect(items[0].querySelector('a')).toBeNull();

		// Second item (id: 3)
		expect(items[1].textContent).toContain('세 번째 글');
		const link3 = items[1].querySelector('a');
		expect(link3).toBeTruthy();
		expect(link3?.getAttribute('href')).toBe('/blog/3-third-post');

		// Third item (id: 1)
		expect(items[2].textContent).toContain('첫 번째 글');
		const link1 = items[2].querySelector('a');
		expect(link1).toBeTruthy();
		expect(link1?.getAttribute('href')).toBe('/blog/1-first-post');
	});
});
