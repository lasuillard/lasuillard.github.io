// @vitest-environment happy-dom
import { expect, it } from 'vitest';

it('run client hooks', () => {
	expect(async () => await import('./hooks.client')).not.toThrow();
});
