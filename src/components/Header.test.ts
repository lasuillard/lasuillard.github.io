// @vitest-environment jsdom
import Header from '$components/Header.svelte';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

describe.each(['header:sm', 'header:md'])('responsive headers (%s)', (headerId) => {
	it('has a link to home', () => {
		const { container } = render(Header);
		expect(container.querySelector('a[href="/"]')).toBeTruthy();
	});

	it('has a link to about', () => {
		const { container } = render(Header);
		expect(container.querySelector('a[href="/about"]')).toBeTruthy();
	});

	it('has a link to blog', () => {
		const { container } = render(Header);
		expect(container.querySelector('a[href="/blog"]')).toBeTruthy();
	});

	it('contains search bar', () => {
		const { container } = render(Header);
		expect(
			container.querySelector(`[data-testid="${headerId}"] [data-testid="search"]`) as HTMLElement
		).toBeTruthy();
	});

	it('contains theme selector', () => {
		const { container } = render(Header);
		expect(
			container.querySelector(
				`[data-testid="${headerId}"] [data-testid="theme-select"]`
			) as HTMLElement
		).toBeTruthy();
	});

	it('contains language selector', () => {
		const { container } = render(Header);
		expect(
			container.querySelector(
				`[data-testid="${headerId}"] [data-testid="language-select"]`
			) as HTMLElement
		).toBeTruthy();
	});
});
