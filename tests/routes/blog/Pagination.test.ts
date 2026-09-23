// @vitest-environment happy-dom
import Pagination from '$routes/blog/Pagination.svelte';
import { render } from '@testing-library/svelte';
import { expect, vi } from 'vitest';
import { it } from '../../_helpers/vitest';

vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));

vi.mock('$app/stores', () => ({
	page: {
		subscribe: (fn: any) => {
			fn({ url: new URL('http://localhost/blog') });
			return () => {};
		}
	}
}));

it('renders correctly with given current and total pages', () => {
	const { getByTestId, queryAllByText } = render(Pagination, {
		currentPage: 1,
		totalPages: 5
	});

	expect(getByTestId('pagination')).toBeTruthy();
	// Check page numbers 1 to 5 exist
	for (let i = 1; i <= 5; i++) {
		expect(queryAllByText(i.toString()).length).toBeGreaterThan(0);
	}
});

it('disables previous button on the first page', () => {
	const { getByLabelText } = render(Pagination, {
		currentPage: 1,
		totalPages: 5
	});

	const prevBtn = getByLabelText('이전 페이지') as HTMLButtonElement;
	expect(prevBtn.tagName).toBe('BUTTON');
	expect(prevBtn.disabled).toBe(true);
});

it('disables next button on the last page', () => {
	const { getByLabelText } = render(Pagination, {
		currentPage: 5,
		totalPages: 5
	});

	const nextBtn = getByLabelText('다음 페이지') as HTMLButtonElement;
	expect(nextBtn.tagName).toBe('BUTTON');
	expect(nextBtn.disabled).toBe(true);
});

it('enables previous and next buttons when on middle pages', () => {
	const { getByLabelText } = render(Pagination, {
		currentPage: 3,
		totalPages: 5
	});

	const prevBtn = getByLabelText('이전 페이지') as HTMLAnchorElement;
	const nextBtn = getByLabelText('다음 페이지') as HTMLAnchorElement;

	expect(prevBtn.tagName).toBe('A');
	expect(prevBtn.getAttribute('href')).toContain('/blog?page=2');

	expect(nextBtn.tagName).toBe('A');
	expect(nextBtn.getAttribute('href')).toContain('/blog?page=4');
});
