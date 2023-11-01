// @vitest-environment happy-dom
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';
import { load } from './+layout';
import Layout from './+layout.svelte';

it('renders', async () => {
	const { container, getByTestId } = render(Layout, {
		// @ts-expect-error Enough for mocking.
		data: await load({ url: { pathname: '' } })
	});
	expect(container).toBeTruthy();
	expect(getByTestId('header')).toBeTruthy();
	expect(getByTestId('main')).toBeTruthy();
	expect(getByTestId('footer')).toBeTruthy();
});
