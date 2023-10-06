// @vitest-environment jsdom
import GitHub from '$components/icon/GitHub.svelte';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

describe('GitHub', () => {
	it('has a valid locator', () => {
		const { getByTestId } = render(GitHub);
		expect(getByTestId('icon/github')).toBeTruthy();
	});
});
