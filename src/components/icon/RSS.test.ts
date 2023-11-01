// @vitest-environment happy-dom
import RSS from '$components/icon/RSS.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('has a valid locator', () => {
	const { getByTestId } = render(RSS);
	expect(getByTestId('icon/rss')).toBeTruthy();
});
