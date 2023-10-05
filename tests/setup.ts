import { cleanup } from '@testing-library/svelte';
import { afterEach, beforeEach, vi } from 'vitest';

// jsdom does not have this
globalThis.matchMedia = globalThis.matchMedia || (() => ({ matches: true }));

beforeEach(() => {});

afterEach(() => {
	vi.resetAllMocks();
	cleanup();
});
