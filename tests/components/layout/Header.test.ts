// @vitest-environment happy-dom
import Header from '$components/layout/Header.svelte';
import { render } from '@testing-library/svelte';
import { expect } from 'vitest';
import { it } from '../../_helpers/vitest';

it('has a valid locator', () => {
	const { getByTestId } = render(Header);
	expect(getByTestId('header')).toBeTruthy();
});

it('has a link to about me', () => {
	const { getAllByText } = render(Header);
	getAllByText('About Me').forEach((elem) => {
		expect(elem.getAttribute('href')).toEqual('/');
	});
});

it('has a link to blog', () => {
	const { getAllByText } = render(Header);
	getAllByText('Blog').forEach((elem) => {
		expect(elem.getAttribute('href')).toEqual('/blog');
	});
});

it('contains theme selector', () => {
	const { getByTestId } = render(Header);
	expect(getByTestId('theme-select')).toBeTruthy();
});

it('contains QR code dropdown', () => {
	const { getByTestId } = render(Header);
	expect(getByTestId('qr-dropdown')).toBeTruthy();
});
