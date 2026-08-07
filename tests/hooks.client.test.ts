import { describe, it, expect, vi, afterAll } from 'vitest';

vi.mock('$env/dynamic/public', () => ({
	env: { PUBLIC_ENVIRONMENT: 'test', PUBLIC_SENTRY_DSN: '' }
}));
vi.mock('$lib/search', () => ({
	initEngine: vi.fn().mockResolvedValue({ termCount: 0 })
}));
vi.mock('$lib/theme', () => ({
	initTheme: vi.fn()
}));
vi.mock('@sentry/sveltekit', () => ({
	init: vi.fn(),
	replayIntegration: vi.fn(),
	consoleLoggingIntegration: vi.fn(),
	handleErrorWithSentry: vi.fn((fn) => fn)
}));
vi.mock('mermaid', () => ({
	default: { initialize: vi.fn() }
}));

const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
const consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

import * as hooks from '../src/hooks.client';

describe('hooks.client', () => {
	afterAll(() => {
		consoleErrorSpy.mockRestore();
		consoleInfoSpy.mockRestore();
		consoleDebugSpy.mockRestore();
		consoleWarnSpy.mockRestore();
	});

	it('handleError should not crash', () => {
		const error = new Error('test error');
		const event = {} as any;

		expect(() => hooks.handleError({ error, event, status: 500, message: 'test' })).not.toThrow();
	});
});
