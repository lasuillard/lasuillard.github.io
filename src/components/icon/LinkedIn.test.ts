// @vitest-environment happy-dom
import LinkedIn from '$components/icon/LinkedIn.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('has a valid locator', () => {
	const { getByTestId } = render(LinkedIn);
	expect(getByTestId('icon/linkedin')).toBeTruthy();
});
