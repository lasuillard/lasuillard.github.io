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

it('has a link to my GitHub profile', () => {
	const { container } = render(Footer);
	const github = container.querySelector('a[href="https://github.com/lasuillard"]') as HTMLElement;
	expect(github).toBeTruthy();
});

it('has a link to my LinkedIn profile', () => {
	const { container } = render(Footer);
	const linkedIn = container.querySelector(
		'a[href="https://www.linkedin.com/in/%EC%9C%A0%EC%B0%AC-%EC%9D%B4-67751020b/"]'
	) as HTMLElement;
	expect(linkedIn).toBeTruthy();
});

it('has a link to send an email to me', () => {
	const { container } = render(Footer);
	const mailto = container.querySelector('a[href="mailto:lasuillard@gmail.com"]') as HTMLElement;
	expect(mailto).toBeTruthy();
});

it('has link to RSS feeds', () => {
	const { container } = render(Footer);
	expect(container.querySelector('a[href="/rss"]')).toBeTruthy();
});
