// @vitest-environment jsdom
import LinkedIn from '$components/icon/LinkedIn.svelte';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

describe('LinkedIn', () => {
	it('has a valid locator', () => {
		const { getByTestId } = render(LinkedIn);
		expect(getByTestId('icon/linkedin')).toBeTruthy();
	});
});
