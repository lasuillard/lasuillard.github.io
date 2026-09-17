// @vitest-environment happy-dom
import { render } from '@testing-library/svelte';
import type { Component } from 'svelte';
import { describe, expect, it } from 'vitest';

const iconModules = import.meta.glob<{ default: Component }>('../../src/components/icon/*.svelte', {
	eager: true
});

const iconEntries = Object.entries(iconModules).map(([path, mod]) => ({
	name: path.split('/').pop()!.replace('.svelte', ''),
	Component: mod.default
}));

describe('icon components', () => {
	it('discovers at least one icon component', () => {
		expect(iconEntries.length).toBeGreaterThan(0);
	});

	it.each(iconEntries)('render icon $name', ({ Component }) => {
		const { container } = render(Component);
		expect(container).toBeTruthy();
		expect(container.querySelector('svg')).toBeTruthy();
	});
});
