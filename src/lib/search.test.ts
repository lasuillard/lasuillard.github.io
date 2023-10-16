import { describe, expect, it, vi } from 'vitest';
import { getEngine, initEngine } from './search';

describe(initEngine, () => {
	it('engine is defined after initialization', async () => {
		expect(getEngine()).toBeUndefined();
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		vi.spyOn(globalThis, 'fetch').mockImplementationOnce(() => ({
			json: vi.fn(() => [])
		}));
		await initEngine();
		expect(getEngine()).toBeDefined();
	});
});

describe.todo(getEngine);
