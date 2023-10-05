// @vitest-environment jsdom
import { persisted } from '$lib/store';
import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';

describe('persisted store', () => {
	it('should conform to store interface and use browser local storage by default', () => {
		const store = persisted('test', 'default-value');

		expect(get(store)).toEqual('default-value');

		let changed = '';
		store.subscribe((value) => {
			changed = value;
		});

		store.set('hello world');
		expect(changed).toEqual('hello world');
		expect(localStorage.getItem('test')).toEqual('"hello world"');

		store.update((value) => value + ', done');
		expect(changed).toEqual('hello world, done');
		expect(localStorage.getItem('test')).toEqual('"hello world, done"');
	});

	it('should compatible with browser session storage', () => {
		const store = persisted('test', 'default-value', {
			storage: sessionStorage
		});

		expect(get(store)).toEqual('default-value');

		let changed = '';
		store.subscribe((value) => {
			changed = value;
		});

		store.set('hello world');
		expect(changed).toEqual('hello world');
		expect(sessionStorage.getItem('test')).toEqual('"hello world"');

		store.update((value) => value + ', done');
		expect(changed).toEqual('hello world, done');
		expect(sessionStorage.getItem('test')).toEqual('"hello world, done"');
	});
});
