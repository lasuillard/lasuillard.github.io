// @vitest-environment happy-dom
import LanguageSelect from '$components/utility/LanguageSelect.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('has a valid locator', () => {
	const { getByTestId } = render(LanguageSelect);
	expect(getByTestId('language-select')).toBeTruthy();
});

it.todo('init with language autodetect from browser');
it.todo('fallbacks to english if user language not supported');
