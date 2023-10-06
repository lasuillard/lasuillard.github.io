// @vitest-environment jsdom
import Gmail from '$components/icon/Gmail.svelte';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

describe('Gmail', () => {
	it('has a valid locator', () => {
		const { getByTestId } = render(Gmail);
		expect(getByTestId('icon/gmail')).toBeTruthy();
	});
});
