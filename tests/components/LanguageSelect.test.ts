// @vitest-environment jsdom
import LanguageSelect from '$components/LanguageSelect.svelte';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

describe('LanguageSelect', () => {
	it('has a valid locator', () => {
		const { getByTestId } = render(LanguageSelect);
		expect(getByTestId('language-select')).toBeTruthy();
	});

	it.todo('should autodetect language from browser');
	it.todo('should fallback to english if user language not supported');
});
