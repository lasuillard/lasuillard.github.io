import { writable, type Updater, type Writable } from 'svelte/store';

interface Storage {
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
	clear(): void;
}

interface Options {
	storage?: Storage;
}

/**
 * Custom store persisting data via browser storage API.
 * @param key Key used in persistence storage backend.
 * @param defaultValue Default value for store if value considered not set.
 * @param options Store options.
 * @returns Store instance.
 */
export function persisted<T>(key: string, defaultValue: T, options?: Options): Writable<T> {
	const storage = options?.storage ?? localStorage;

	// Load previous value from storage
	const initialValue = JSON.parse(storage.getItem(key) || 'null') ?? defaultValue;
	const { subscribe, set: _set, update: _update } = writable(initialValue);

	return {
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
}