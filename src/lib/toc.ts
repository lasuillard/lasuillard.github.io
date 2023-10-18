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
