// @vitest-environment jsdom
import LanguageSelect from '$components/LanguageSelect.svelte';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

describe('LanguageSelect', () => {
	it('has a valid locator', () => {
		const { getByTestId } = render(LanguageSelect);
		expect(getByTestId('language-select')).toBeTruthy();
	});

	it.todo('init with language autodetect from browser');
	it.todo('fallbacks to english if user language not supported');
});
