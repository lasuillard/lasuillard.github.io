// @vitest-environment jsdom
import Footer from '$components/Footer.svelte';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

describe('Footer', () => {
	it('has a valid locator', () => {
		const { getByTestId } = render(Footer);
		expect(getByTestId('footer')).toBeTruthy();
	});
});
