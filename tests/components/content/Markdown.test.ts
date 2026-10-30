// @vitest-environment happy-dom
import Markdown from "#components/content/Markdown.svelte";
import { render as renderMarkdown } from "#lib/markdown.js";
import { fireEvent, render, waitFor } from "@testing-library/svelte";
import { tick } from "svelte";
import { expect, it, vi } from "vitest";

// NOTE: It is required not to have any wrapping element (thus no locator) as this component is just an wrapper

it("render with parsed content", async () => {
  const { content } = await renderMarkdown(`# Lorem Ipsum

Lorem Ipsum is simply dummy text of the printing and typesetting industry.`);
  const { container } = render(Markdown, { content, children: undefined });
  expect(container.innerHTML).toMatchInlineSnapshot(`
		"<!----><!----><h1 id="lorem-ipsum"><a href="#lorem-ipsum">Lorem Ipsum</a></h1>
		<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>"
	`);
});

it("render with nothing", async () => {
  const { container } = render(Markdown);
  expect(container.innerHTML).toMatchInlineSnapshot(
    `"<!----><div class="hidden"><!----></div>"`,
  );
});

it("shows footnote preview when hovering footnote reference", async () => {
  const { content } = await renderMarkdown(
    "Hello world[^1]\n\n[^1]: My footnote text",
  );
  const { container } = render(Markdown, { content, children: undefined });
  await waitFor(() => {
    expect(container.querySelector("a[data-footnote-ref]")).toBeTruthy();
  });

  const ref = container.querySelector(
    "a[data-footnote-ref]",
  ) as HTMLAnchorElement;
  await fireEvent.mouseEnter(ref);

  await waitFor(() => {
    const preview = document.querySelector('[data-testid="footnote-preview"]');
    expect(preview).toBeTruthy();
    expect(preview?.textContent).toContain("My footnote text");
  });
});

it("does not initialize footnote previews after unmount", async () => {
  const { content } = await renderMarkdown(
    "Hello world[^1]\n\n[^1]: My footnote text",
  );
  const { unmount } = render(Markdown, { content, children: undefined });
  const appendChild = vi.spyOn(document.body, "appendChild");

  unmount();
  await tick();
  await Promise.resolve();

  expect(appendChild).not.toHaveBeenCalled();
});

it.todo("render with raw markdown input slot"); // https://github.com/testing-library/svelte-testing-library/issues/48
