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

describe.todo(getEngine);
