import { makeToc, type TreeSource } from '$lib/toc';
import { describe, expect, it } from 'vitest';

describe(makeToc, () => {
	it('make TOC tree from list of headings', () => {
		const arr = ['H1', 'H1', 'H4', 'H3', 'H2', 'H3', 'H2', 'H1', 'H3', 'H4', 'H5', 'H2', 'H6'];

		const root = {
			data: 'H0',
			children: []
		};
		const items = arr.map((v) => ({
			data: v,
			children: [],
			compare(other: TreeSource<string, string>): number {
				return this.data < other.data ? -1 : this.data == other.data ? 0 : 1;
			},
			toNode() {
				return {
					data: this.data,
					children: []
				};
			}
		}));
		makeToc(root, items);

		/*
      H0(-1) -- Dummy root
      ├ H1(0)
      ├ H1(1)
      │ ├ H4(2)
      │ ├ H3(3)
      │ ├ H2(4)
      │ │ └ H3(5)
      │ └ H2(6)
      └ H1(7)
        ├ H3(8)
        │ └ H4(9)
        │   └ H5(10)
        └ H2(11)
          └ H6(12)
    */
		expect(root).toEqual({
			// Dummy root
			data: 'H0',
			children: [
				{
					data: 'H1',
					children: []
				},
				{
					data: 'H1',
					children: [
						{
							data: 'H4',
							children: []
						},
						{
							data: 'H3',
							children: []
						},
						{
							data: 'H2',
							children: [
								{
									data: 'H3',
									children: []
								}
							]
						},
						{
							data: 'H2',
							children: []
						}
					]
				},
				{
					data: 'H1',
					children: [
						{
							data: 'H3',
							children: [
								{
									data: 'H4',
									children: [
										{
											data: 'H5',
											children: []
										}
									]
								}
							]
						},
						{
							data: 'H2',
							children: [
								{
									data: 'H6',
									children: []
								}
							]
						}
					]
				}
			]
		});
	});
});
