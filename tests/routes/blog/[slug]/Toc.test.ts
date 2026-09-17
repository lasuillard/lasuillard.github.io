// @vitest-environment happy-dom
import Toc from '$routes/blog/[slug]/Toc.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('has a valid locator', () => {
	const { getByTestId } = render(Toc);
	expect(getByTestId('toc')).toBeTruthy();
});

it('make ToC from given HTML element', () => {
	/*
    content
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
	const content = document.createElement('div');
	content.innerHTML = `<h1>0</h1>
<h1>1</h1>
<h4>2</h4>
<h3>3</h3>
<h2>4</h2>
<h3>5</h3>
<h2>6</h2>
<h1>7</h1>
<h3>8</h3>
<h4>9</h4>
<h5>10</h5>
<h2>11</h2>
<h6>12</h6>
`;

	const { getByTestId } = render(Toc, { content });
	expect(getByTestId('toc').innerHTML).toMatchInlineSnapshot(
		`"<button type="button" class="cursor-pointer border-none bg-transparent p-0 text-left outline-none" aria-label="목차 열기" aria-expanded="false"><!----><div data-testid="toc-tree" class="flex flex-col items-start ml-0 my-1"><div class="h-1 w-6 rounded-full transition-all duration-200 bg-base-content/25"></div></div> <!----><!----><div data-testid="toc-tree" class="flex flex-col items-start ml-0 my-1"><div class="h-1 w-6 rounded-full transition-all duration-200 bg-base-content/25"></div></div> <!----><div data-testid="toc-tree" class="flex flex-col items-start ml-4 my-1"><div class="h-1 w-2.5 rounded-full transition-all duration-200 bg-base-content/25"></div></div> <!----><!----><div data-testid="toc-tree" class="flex flex-col items-start ml-2 my-1"><div class="h-1 w-4 rounded-full transition-all duration-200 bg-base-content/25"></div></div> <!----><!----><div data-testid="toc-tree" class="flex flex-col items-start ml-0 my-1"><div class="h-1 w-6 rounded-full transition-all duration-200 bg-base-content/25"></div></div> <!----><div data-testid="toc-tree" class="flex flex-col items-start ml-2 my-1"><div class="h-1 w-4 rounded-full transition-all duration-200 bg-base-content/25"></div></div> <!----><!----><!----><div data-testid="toc-tree" class="flex flex-col items-start ml-0 my-1"><div class="h-1 w-6 rounded-full transition-all duration-200 bg-base-content/25"></div></div> <!----><!----><!----><div data-testid="toc-tree" class="flex flex-col items-start ml-0 my-1"><div class="h-1 w-6 rounded-full transition-all duration-200 bg-base-content/25"></div></div> <!----><div data-testid="toc-tree" class="flex flex-col items-start ml-2 my-1"><div class="h-1 w-4 rounded-full transition-all duration-200 bg-base-content/25"></div></div> <!----><div data-testid="toc-tree" class="flex flex-col items-start ml-4 my-1"><div class="h-1 w-2.5 rounded-full transition-all duration-200 bg-base-content/25"></div></div> <!----><div data-testid="toc-tree" class="flex flex-col items-start ml-4 my-1"><div class="h-1 w-2.5 rounded-full transition-all duration-200 bg-base-content/25"></div></div> <!----><!----><!----><!----><div data-testid="toc-tree" class="flex flex-col items-start ml-0 my-1"><div class="h-1 w-6 rounded-full transition-all duration-200 bg-base-content/25"></div></div> <!----><div data-testid="toc-tree" class="flex flex-col items-start ml-4 my-1"><div class="h-1 w-2.5 rounded-full transition-all duration-200 bg-base-content/25"></div></div> <!----><!----><!----></button><!---->"`
	);
});

it("shouldn't bothering if there is no heading", () => {
	const { container } = render(Toc, { content: document.createElement('div') });
	expect(container).toBeTruthy();
});
