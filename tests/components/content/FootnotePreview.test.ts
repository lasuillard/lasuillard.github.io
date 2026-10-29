// @vitest-environment happy-dom
import FootnotePreview from "#components/content/FootnotePreview.svelte";
import { fireEvent, render, waitFor } from "@testing-library/svelte";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("FootnotePreview", () => {
  let host: HTMLElement;
  let refLink: HTMLAnchorElement;

  beforeEach(() => {
    vi.useFakeTimers();
    host = document.createElement("div");
    host.innerHTML = `
      <p>Hello<sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref>1</a></sup></p>
      <section class="footnotes">
        <ol>
          <li id="user-content-fn-1">
            <p>Detailed footnote explanation <a href="#user-content-fnref-1" data-footnote-backref>↩</a></p>
          </li>
        </ol>
      </section>
    `;
    document.body.appendChild(host);
    refLink = host.querySelector("a[data-footnote-ref]") as HTMLAnchorElement;
  });

  afterEach(() => {
    host.remove();
    vi.useRealTimers();
  });

  it("shows footnote content without backref on hover and hides after mouseleave delay", async () => {
    const { queryByTestId, getByTestId } = render(FootnotePreview, {
      refs: [refLink],
    });

    expect(queryByTestId("footnote-preview")).toBeNull();

    await fireEvent.mouseEnter(refLink);

    const preview = getByTestId("footnote-preview");
    expect(preview).toBeTruthy();
    expect(preview.textContent).toContain("Detailed footnote explanation");
    expect(preview.textContent).not.toContain("↩");

    // Hovering into the preview keeps it visible
    await fireEvent.mouseLeave(refLink);
    await fireEvent.mouseEnter(preview);
    vi.advanceTimersByTime(200);
    expect(queryByTestId("footnote-preview")).toBeTruthy();

    // Leaving the preview hides it after the grace delay
    await fireEvent.mouseLeave(preview);
    vi.advanceTimersByTime(200);
    await waitFor(() => {
      expect(queryByTestId("footnote-preview")).toBeNull();
    });
  });

  it("shows on focus and hides on scroll", async () => {
    const { queryByTestId } = render(FootnotePreview, {
      refs: [refLink],
    });

    await fireEvent.focus(refLink);
    expect(queryByTestId("footnote-preview")).toBeTruthy();

    await fireEvent.scroll(window);
    await waitFor(() => {
      expect(queryByTestId("footnote-preview")).toBeNull();
    });
  });
});
