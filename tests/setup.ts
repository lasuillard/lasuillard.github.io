import { cleanup } from '@testing-library/svelte';
import { afterEach, beforeEach, vi } from 'vitest';

beforeEach(() => {
	// Stub default color scheme preference to dark
	vi.stubGlobal(
		'matchMedia',
		vi.fn((query: string) => {
			return { matches: query === '(prefers-color-scheme: dark)' };
		})
	);
	vi.mock('$app/environment', () => ({ browser: true }));
});

afterEach(() => {
	vi.unstubAllGlobals();
	vi.resetAllMocks();
	cleanup();
});
