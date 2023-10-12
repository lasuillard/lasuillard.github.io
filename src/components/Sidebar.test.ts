// @vitest-environment jsdom
import Sidebar from '$components/Sidebar.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('has a avatar', () => {
	const { container } = render(Sidebar);
	const profile = container.querySelector(
		'img[src^="https://www.gravatar.com/avatar/ff482bc4abad770478cc7bd36cb490fd"]'
	) as HTMLElement;
	expect(profile).toBeTruthy();
});

it('has a link to my GitHub profile', () => {
	const { container } = render(Sidebar);
	const github = container.querySelector('a[href="https://github.com/lasuillard"]') as HTMLElement;
	expect(github).toBeTruthy();
});

it('has a link to my LinkedIn profile', () => {
	const { container } = render(Sidebar);
	const linkedIn = container.querySelector(
		'a[href="https://www.linkedin.com/in/%EC%9C%A0%EC%B0%AC-%EC%9D%B4-67751020b/"]'
	) as HTMLElement;
	expect(linkedIn).toBeTruthy();
});

it('has a link to send an email to me', () => {
	const { container } = render(Sidebar);
	const mailto = container.querySelector('a[href="mailto:lasuillard@gmail.com"]') as HTMLElement;
	expect(mailto).toBeTruthy();
});
