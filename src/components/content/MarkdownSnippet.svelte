<script lang="ts">
	let { rawMarkdown = '', terms = [] as string[], adjacentLines = 3 } = $props();

	let htmlContent = $state('');

	function getSnippetLines(content: string, terms: string[], adjacentLines: number) {
		if (!content) return '';

		const lines = content.split('\n');
		const blocks: string[] = [];
		let currentBlock: string[] = [];
		let inCodeBlock = false;

		for (const line of lines) {
			if (line.trim().startsWith('```')) {
				inCodeBlock = !inCodeBlock;
			}

			if (!inCodeBlock && line.trim() === '') {
				if (currentBlock.length > 0) {
					blocks.push(currentBlock.join('\n'));
					currentBlock = [];
				}
			} else {
				currentBlock.push(line);
			}
		}
		if (currentBlock.length > 0) {
			blocks.push(currentBlock.join('\n'));
		}

		// Replace mermaid diagram blocks with a placeholder — rendering in a snippet is not reliable
		const processedBlocks = blocks.map((block) =>
			block.split('\n').some((line) => line.trim() === '```mermaid')
				? '_[Mermaid 다이어그램]_'
				: block
		);

		let bestMatchBlockIndex = -1;
		const lowerBlocks = processedBlocks.map((b) => b.toLowerCase());
		for (const term of terms) {
			const lowerTerm = term.toLowerCase();
			for (let i = 0; i < lowerBlocks.length; i++) {
				if (lowerBlocks[i].includes(lowerTerm)) {
					if (bestMatchBlockIndex === -1 || i < bestMatchBlockIndex) {
						bestMatchBlockIndex = i;
					}
					break;
				}
			}
		}

		const snippetBlocks =
			bestMatchBlockIndex === -1
				? processedBlocks.slice(0, adjacentLines * 2 + 1)
				: processedBlocks.slice(
						Math.max(0, bestMatchBlockIndex - adjacentLines),
						Math.min(processedBlocks.length - 1, bestMatchBlockIndex + adjacentLines) + 1
					);

		return snippetBlocks.join('\n\n');
	}

	$effect(() => {
		let cancelled = false;
		const currentTerms = [...terms];
		const snippetMarkdown = getSnippetLines(rawMarkdown, currentTerms, adjacentLines);

		import('$lib/markdown').then(({ parse }) => {
			parse(snippetMarkdown).then((res) => {
				if (cancelled) return;
				const validTerms = currentTerms
					.filter((t) => t.trim() !== '')
					.sort((a, b) => b.length - a.length);
				if (validTerms.length === 0) {
					htmlContent = res.content;
					return;
				}

				const escapedTerms = validTerms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
				const regex = new RegExp(escapedTerms.join('|'), 'gi');

				const template = document.createElement('template');
				template.innerHTML = res.content;

				const walk = (n: Node) => {
					if (n.nodeType === Node.TEXT_NODE) {
						let text = n.textContent || '';
						regex.lastIndex = 0;
						const matches = Array.from(text.matchAll(regex));
						if (matches.length > 0) {
							const fragment = document.createDocumentFragment();
							let lastIndex = 0;

							for (let i = 0; i < matches.length; i++) {
								const m = matches[i];
								const matchStr = m[0];
								const start = m.index!;
								const end = start + matchStr.length;

								let beforeText = text.slice(lastIndex, start);

								if (i === 0) {
									if (beforeText.length > 30) {
										beforeText = '...' + beforeText.slice(-30);
									}
								} else {
									if (beforeText.length > 60) {
										beforeText = beforeText.slice(0, 30) + '...' + beforeText.slice(-30);
									}
								}

								if (beforeText) {
									fragment.appendChild(document.createTextNode(beforeText));
								}

								const mark = document.createElement('mark');
								mark.className = 'bg-warning text-warning-content rounded-xs px-1 font-bold';
								mark.textContent = matchStr;
								fragment.appendChild(mark);
								lastIndex = end;
							}

							let afterText = text.slice(lastIndex);
							if (afterText.length > 30) {
								afterText = afterText.slice(0, 30) + '...';
							}
							if (afterText) {
								fragment.appendChild(document.createTextNode(afterText));
							}

							n.parentNode?.replaceChild(fragment, n);
						} else {
							if (text.length > 50) {
								n.textContent = text.slice(0, 50) + '...';
							}
						}
					} else if (n.nodeName !== 'MARK' && n.childNodes) {
						if (n.nodeType === Node.ELEMENT_NODE) {
							const el = n as Element;
							if (
								el.classList.contains('mermaid') ||
								el.matches('pre > code[class*="language-mermaid"]')
							) {
								return;
							}
						}
						Array.from(n.childNodes).forEach(walk);
					}
				};

				walk(template.content);
				htmlContent = template.innerHTML;
			});
		});
		return () => {
			cancelled = true;
		};
	});
</script>

<div
	class="prose prose-sm prose-p:my-1 prose-headings:my-2 prose-pre:my-1 prose-pre:overflow-hidden prose-pre:whitespace-pre-wrap prose-img:hidden max-w-none text-left text-xs leading-relaxed wrap-break-word"
>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html htmlContent}
</div>
