// @vitest-environment jsdom
import LanguageSelect from '$components/LanguageSelect.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('nothing to test yet, just render it', () => {
	const { container } = render(LanguageSelect);
	expect(container).toBeTruthy();
});

it.todo('should autodetect language from browser');
it.todo('should fallback to english if user language not supported');