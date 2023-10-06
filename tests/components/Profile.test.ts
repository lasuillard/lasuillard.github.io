// @vitest-environment jsdom
import Profile from '$components/Profile.svelte';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

describe('Profile', () => {
	it('has a valid locator', () => {
		const { getByTestId } = render(Profile);
		expect(getByTestId('profile')).toBeTruthy();
	});

	describe('avatar', () => {
		it('should have a avatar', () => {
			const { container } = render(Profile);
			const profile = container.querySelector(
				'img[src^="https://www.gravatar.com/avatar/ff482bc4abad770478cc7bd36cb490fd"]'
			) as HTMLElement;
			expect(profile).toBeTruthy();
		});
	});

	describe('GitHub link', () => {
		it('should have a link to my GitHub profile', () => {
			const { container } = render(Profile);
			const github = container.querySelector(
				'a[href="https://github.com/lasuillard"]'
			) as HTMLElement;
			expect(github).toBeTruthy();
		});
	});

	describe('LinkedIn link', () => {
		it('should have a link to my LinkedIn profile', () => {
			const { container } = render(Profile);
			const linkedIn = container.querySelector(
				'a[href="https://www.linkedin.com/in/%EC%9C%A0%EC%B0%AC-%EC%9D%B4-67751020b/"]'
			) as HTMLElement;
			expect(linkedIn).toBeTruthy();
		});
	});

	describe('Gmail link', () => {
		it('should have a link to send an email to me', () => {
			const { container } = render(Profile);
			const mailto = container.querySelector(
				'a[href="mailto:lasuillard@gmail.com"]'
			) as HTMLElement;
			expect(mailto).toBeTruthy();
		});
	});
});
