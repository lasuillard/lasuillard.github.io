// @vitest-environment happy-dom
import GitHub from '$components/icon/GitHub.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('has a valid locator', () => {
	const { getByTestId } = render(GitHub);
	expect(getByTestId('icon/github')).toBeTruthy();
});
