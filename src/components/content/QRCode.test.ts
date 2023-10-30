// @vitest-environment happy-dom
import QRCode from '$components/content/QRCode.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('has a valid locator', () => {
	const { getByTestId } = render(QRCode, { text: 'Hello, World!' });
	expect(getByTestId('qrcode')).toBeTruthy();
});

it('has a link in title for generated code', () => {
	const { getByTestId } = render(QRCode, { text: 'Hello, World!' });
	expect(getByTestId('qrcode').title).toEqual('Hello, World!');
});
