// @vitest-environment happy-dom
import { expect, it } from 'vitest';

it('run client hooks', () => {
	expect(async () => {
		const { initializers } = await import('../src/hooks.client');
		await Promise.all(initializers);
	}).not.toThrow();
});
