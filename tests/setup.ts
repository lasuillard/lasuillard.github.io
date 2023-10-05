import { cleanup } from '@testing-library/svelte';
import { afterEach, beforeEach, vi } from 'vitest';

beforeEach(() => {});

afterEach(() => {
	vi.resetAllMocks();
	cleanup();
});
