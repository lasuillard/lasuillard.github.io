import { describe, expect, it } from 'vitest';
import { titleWithSuffix } from '~/lib/meta';

describe(titleWithSuffix, () => {
	it('returns new title with suffix', () => {
		expect(titleWithSuffix('Home')).toEqual("Home • lasuillard's Blog");
	});

	it('returns `"Untitled"` if title is `undefined`', () => {
		expect(titleWithSuffix(undefined)).toEqual('Untitled');
	});
});
