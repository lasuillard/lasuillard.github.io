export interface TreeNode<T> {
	data: T;
	children: TreeNode<T>[];
}

/**
 * Build tree recursively.
 * @param parent Parent node including current slice.
 * @param items Full list of items.
 * @param start Start of slice.
 * @param end End of slice.
 */
function buildTree<S, T>(
	parent: TreeNode<T>,
	items: TreeSource<S, T>[],
	start: number,
	end: number
) {
	let i = start;
	while (i < end) {
		const base = items[i];
		let j = i + 1;
		for (; j < end; j++) {
			const elem = items[j];
			if (elem.compare(base) <= 0) {
				break;
			}
		}
		const section = items[i].toNode();
		parent.children.push(section);
		buildTree(section, items, i + 1, j);
		i = j;
	}
}

export interface TreeSource<S, T> {
	data: S;

	/** Compares this with other. Should return `-1` if `this` is less than `other`, `0` if equals, otherwise `1` (greater than). */
	compare(other: TreeSource<S, T>): number;

	/** Create node from this source. */
	toNode(): TreeNode<T>;
}

/**
 * Create TOC tree from linear list of headings.
 * @param root Dummy root node.
 * @param items List of headings.
 */
export function makeToc<S, T>(root: TreeNode<T>, items: TreeSource<S, T>[]) {
	buildTree(root, items, 0, items.length);
}

/* c8 ignore start */
if (import.meta.vitest) {
	const { describe, expect, it } = import.meta.vitest;

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
}
/* c8 ignore stop */
