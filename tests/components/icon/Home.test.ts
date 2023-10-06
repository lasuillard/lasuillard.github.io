// @vitest-environment jsdom
import Home from '$components/icon/Home.svelte';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

describe('Home', () => {
	it('has a valid locator', () => {
		const { getByTestId } = render(Home);
		expect(getByTestId('icon/home')).toBeTruthy();
	});
});
