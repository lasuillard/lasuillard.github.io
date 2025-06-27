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

it('sets custom width when provided', () => {
	const { getByTestId } = render(QRCode, { text: 'Hello, World!', width: 256 });
	const canvas = getByTestId('qrcode') as HTMLCanvasElement;
	expect(canvas.width).toBe(256);
});

it('uses default width when not provided', () => {
	const { getByTestId } = render(QRCode, { text: 'Hello, World!' });
	const canvas = getByTestId('qrcode') as HTMLCanvasElement;
	expect(canvas.width).toBe(128);
});

// FIXME: Canvas raising errors
