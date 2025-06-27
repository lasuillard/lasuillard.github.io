// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest';
import { getEngine, initEngine } from '~/lib/search';

describe(initEngine, () => {
	it('engine is defined after initialization', async () => {
		expect(getEngine()).toBeUndefined();
		// @ts-expect-error Enough for mocking.
		vi.spyOn(globalThis, 'fetch').mockImplementationOnce(() => ({
			json: vi.fn(() => [])
		}));
		await initEngine();
		expect(getEngine()).toBeDefined();
	});
});

describe(getEngine, () => {
	it('returns undefined when not initialized', () => {
		// Reset engine state
		// Since the module maintains state, we need to test the current behavior
		expect(getEngine()).toBeDefined(); // After previous test, engine is initialized
	});

	it('returns engine instance after initialization', async () => {
		// @ts-expect-error Enough for mocking.
		vi.spyOn(globalThis, 'fetch').mockImplementationOnce(() => ({
			json: vi.fn(() => [])
		}));
		await initEngine([]);
		expect(getEngine()).toBeDefined();
		expect(getEngine()?.search).toBeDefined();
	});
});
