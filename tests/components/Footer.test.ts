// @vitest-environment jsdom
import Footer from '$components/Footer.svelte';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

describe('Footer', () => {
	it('nothing to test yet, just render it', () => {
		const { container } = render(Footer);
		expect(container).toBeTruthy();
	});
});
