// @vitest-environment jsdom
import Profile from '$components/Profile.svelte';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

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
