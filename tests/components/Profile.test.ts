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
		it('contain a gravatar profile image', () => {
			const { container } = render(Profile);
			const profile = container.querySelector(
				'img[src^="https://www.gravatar.com/avatar/"]'
			) as HTMLElement;
			expect(profile).toBeTruthy();
		});

		it.todo('image URL is valid');
	});

	describe('GitHub link', () => {
		it('has a link to my GitHub profile', () => {
			const { container } = render(Profile);
			const github = container.querySelector(
				'a[href="https://github.com/lasuillard"]'
			) as HTMLElement;
			expect(github).toBeTruthy();
		});

		it.todo('link is valid');
	});

	describe('LinkedIn link', () => {
		it('has a link to my LinkedIn profile', () => {
			const { container } = render(Profile);
			const linkedIn = container.querySelector(
				'a[href="https://www.linkedin.com/in/%EC%9C%A0%EC%B0%AC-%EC%9D%B4-67751020b/"]'
			) as HTMLElement;
			expect(linkedIn).toBeTruthy();
		});

		it.todo('link is valid');
	});

	describe('Gmail link', () => {
		it('has a link to send an email to me', () => {
			const { container } = render(Profile);
			const mailto = container.querySelector(
				'a[href="mailto:lasuillard@gmail.com"]'
			) as HTMLElement;
			expect(mailto).toBeTruthy();
		});

		it.todo('email is valid');
	});
});
