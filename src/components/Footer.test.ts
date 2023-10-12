// @vitest-environment jsdom
import Footer from '$components/Footer.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('includes copyright notice', () => {
	const { container } = render(Footer);
	const currentYear = new Date().getFullYear();
	expect(container.textContent).toMatch(
		new RegExp(`([cC]opyright|©) (2023 - ${currentYear}) Yuchan Lee. All rights reserved.`)
	);
});

it('has link to RSS feeds', () => {
	const { container } = render(Footer);
	expect(container.querySelector('a[href="/rss"]')).toBeTruthy();
});
