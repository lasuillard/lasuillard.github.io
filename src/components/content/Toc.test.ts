// @vitest-environment happy-dom
import Toc from '$components/content/Toc.svelte';
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
	expect(getByTestId('toc').innerHTML).toMatchSnapshot();
});

it("shouldn't bothering if there is no heading", () => {
	const { container } = render(Toc, { content: document.createElement('div') });
	expect(container).toBeTruthy();
});
