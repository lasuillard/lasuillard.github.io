// @vitest-environment jsdom
import { persisted } from '$lib/store';
import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';

describe('persisted store', () => {
	it('should conform to store interface and use browser local storage by default', () => {
		const key = Math.random().toString();
		const store = persisted(key, 'default-value');
		expect(get(store)).toEqual('default-value');

		let changed = '';
		store.subscribe((value) => {
			changed = value;
		});

		store.set('hello world');
		expect(changed).toEqual('hello world');
		expect(localStorage.getItem(key)).toEqual('"hello world"');

		store.update((value) => value + ', done');
		expect(changed).toEqual('hello world, done');
		expect(localStorage.getItem(key)).toEqual('"hello world, done"');
	});

	it('should compatible with browser session storage', () => {
		const key = Math.random().toString();
		const store = persisted(key, 'default-value', {
			storage: sessionStorage
		});
		expect(get(store)).toEqual('default-value');

		let changed = '';
		store.subscribe((value) => {
			changed = value;
		});

		store.set('hello world');
		expect(changed).toEqual('hello world');
		expect(sessionStorage.getItem(key)).toEqual('"hello world"');

		store.update((value) => value + ', done');
		expect(changed).toEqual('hello world, done');
		expect(sessionStorage.getItem(key)).toEqual('"hello world, done"');
	});
});