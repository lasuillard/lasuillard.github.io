// @vitest-environment jsdom
import Header from '$components/Header.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

const headerId = 'header';

it('has a link to home', () => {
	const { container } = render(Header);
	expect(container.querySelectorAll(`[data-testid="${headerId}"] a[href="/"]`)).toHaveLength(2);
});

it('has a link to about', () => {
	const { container } = render(Header);
	expect(container.querySelectorAll(`[data-testid="${headerId}"] a[href="/about"]`)).toHaveLength(
		2
	);
});

it('has a link to blog', () => {
	const { container } = render(Header);
	expect(container.querySelectorAll(`[data-testid="${headerId}"] a[href="/blog"]`)).toHaveLength(2);
});

it('contains theme selector', () => {
	const { container } = render(Header);
	expect(
		container.querySelectorAll(`[data-testid="${headerId}"] [data-testid="theme-select"]`)
	).toHaveLength(2);
});

it('contains language selector', () => {
	const { container } = render(Header);
	expect(
		container.querySelectorAll(`[data-testid="${headerId}"] [data-testid="language-select"]`)
	).toHaveLength(2);
});
