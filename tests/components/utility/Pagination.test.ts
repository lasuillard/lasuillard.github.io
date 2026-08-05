// @vitest-environment happy-dom
import Pagination from '$components/utility/Pagination.svelte';
import { render } from '@testing-library/svelte';
import { expect, vi } from 'vitest';
import { it } from '../../_helpers/vitest';
import { goto } from '$app/navigation';

vi.mock('$app/navigation', () => ({
	goto: vi.fn()
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

it('disables previous and first buttons on the first page', () => {
	const { getByLabelText } = render(Pagination, {
		currentPage: 1,
		totalPages: 5
	});

	const firstBtn = getByLabelText('First page');
	const prevBtn = getByLabelText('Previous page');

	expect(firstBtn.classList.contains('btn-disabled')).toBe(true);
	expect(prevBtn.classList.contains('btn-disabled')).toBe(true);
});

it('disables next and last buttons on the last page', () => {
	const { getByLabelText } = render(Pagination, {
		currentPage: 5,
		totalPages: 5
	});

	const nextBtn = getByLabelText('Next page');
	const lastBtn = getByLabelText('Last page');

	expect(nextBtn.classList.contains('btn-disabled')).toBe(true);
	expect(lastBtn.classList.contains('btn-disabled')).toBe(true);
});

it('prompts user and navigates when clicking on ... button with valid input', async ({ user }) => {
	const promptMock = vi.fn().mockReturnValue('8');
	const alertMock = vi.fn();
	vi.stubGlobal('prompt', promptMock);
	vi.stubGlobal('alert', alertMock);

	const { getByLabelText } = render(Pagination, {
		currentPage: 1,
		totalPages: 10
	});

	const ellipsisBtn = getByLabelText('Go to page');
	expect(ellipsisBtn).toBeTruthy();

	await user.click(ellipsisBtn);

	expect(promptMock).toHaveBeenCalled();
	expect(goto).toHaveBeenCalledWith('/blog?page=8');

	vi.unstubAllGlobals();
});

it('shows alert and does not navigate when prompt input is invalid', async ({ user }) => {
	const promptMock = vi.fn().mockReturnValue('999'); // invalid page number
	const alertMock = vi.fn();
	vi.stubGlobal('prompt', promptMock);
	vi.stubGlobal('alert', alertMock);

	const { getByLabelText } = render(Pagination, {
		currentPage: 1,
		totalPages: 10
	});

	const ellipsisBtn = getByLabelText('Go to page');
	await user.click(ellipsisBtn);

	expect(promptMock).toHaveBeenCalled();
	expect(alertMock).toHaveBeenCalled();
	expect(goto).not.toHaveBeenCalledWith('/blog?page=999');

	vi.unstubAllGlobals();
});
