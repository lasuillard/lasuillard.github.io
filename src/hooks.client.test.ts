// @vitest-environment happy-dom
import { expect, it } from 'vitest';

it('run client hooks', () => {
	expect(async () => {
		const { initializers } = await import('./hooks.client');
		await Promise.all(initializers);
	}).not.toThrow();
});
