// @vitest-environment jsdom
import QRCode from '$components/QRCode.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('has a valid locator', () => {
	const { getByTestId } = render(QRCode, { textGetter: () => 'Hello, World!' });
	expect(getByTestId('qrcode')).toBeTruthy();
});
