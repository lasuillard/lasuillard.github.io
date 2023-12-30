import { browser } from '$app/environment';
import { get, writable, type Updater, type Writable } from 'svelte/store';
import { getVarName } from './utils';

interface Storage {
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
	clear(): void;
}

interface Options {
	storage?: Storage;
}

// NOTE: No-op storage for non-browser env (SSR prerendering)
export const nullStorage = {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	getItem(key: string): string | null {
		return null;
	},
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	setItem(key: string, value: string): void {},
	clear() {}
};

/**
 * Custom store persisting data via browser storage API.
 * @param key Key used in persistence storage backend.
 * @param defaultValue Default value for store if value considered not set.
 * @param options Store options.
 * @returns Store instance.
 */
export function persisted<T>(key: string, defaultValue: T, options?: Options): Writable<T> {
	const storage = options?.storage ?? (browser ? localStorage : nullStorage);

	// Load previous value from storage
	const initialValue = JSON.parse(storage.getItem(key) || 'null') ?? defaultValue;

	// Create store and wrap
	const { subscribe, set: _set, update: _update } = writable(initialValue);
	const store = {
		subscribe,
		set: (value: T) => {
			storage.setItem(key, JSON.stringify(value));
			_set(value);
		},
		update: (callback: Updater<T>) =>
			_update((last: T) => {
				const value = callback(last);
				storage.setItem(key, JSON.stringify(value));
				_set(value);

				return value;
			})
	};

	return store;
}

/* c8 ignore start */
if (import.meta.vitest) {
	// @vitest-environment happy-dom
	const { describe, expect, it } = import.meta.vitest;

	describe(getVarName({ nullStorage }), () => {
		it('should satisfy to browser storage API interface', () => {
			const key = Math.random().toString();
			expect(nullStorage.getItem(key)).toBeNull();
			expect(() => nullStorage.setItem(key, 'hello world')).not.toThrow();
			expect(() => nullStorage.clear()).not.toThrow();
		});
	});

	describe(getVarName({ persisted }), () => {
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

		it.todo('should default to null storage if current environment is not a browser');
	});
}
/* c8 ignore stop */
