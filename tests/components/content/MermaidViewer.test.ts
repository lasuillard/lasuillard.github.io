// @vitest-environment happy-dom
import MermaidViewer from "#components/content/MermaidViewer.svelte";
import { Theme, currentTheme, initTheme } from "#lib/theme.js";
import { fireEvent, render, waitFor } from "@testing-library/svelte";
import mermaid from "mermaid";
import { tick } from "svelte";
import { beforeEach, describe, expect, vi } from "vitest";
import { it } from "../../_helpers/vitest";

vi.mock("mermaid", () => ({
  default: {
    initialize: vi.fn(),
    render: vi.fn().mockResolvedValue({
      svg: '<svg data-testid="mock-mermaid-svg"><g></g></svg>',
    }),
  },
}));

beforeEach(() => {
  initTheme();
  vi.mocked(mermaid.render).mockResolvedValue({
    svg: '<svg data-testid="mock-mermaid-svg"><g></g></svg>',
    diagramType: "flowchart",
  });
});

describe("MermaidViewer", () => {
  it("renders mermaid diagram with current theme and re-renders on theme change", async () => {
    currentTheme?.set(Theme.Light);
    const { getByTestId } = render(MermaidViewer, {
      code: "graph LR\n  A --> B",
    });

    await waitFor(() => {
      expect(mermaid.initialize).toHaveBeenCalledWith(
        expect.objectContaining({
          theme: "default",
        }),
      );
      expect(getByTestId("mock-mermaid-svg")).toBeTruthy();
    });

    currentTheme?.set(Theme.Dark);
    await tick();

    await waitFor(() => {
      expect(mermaid.initialize).toHaveBeenCalledWith(
        expect.objectContaining({
          theme: "dark",
        }),
      );
    });
  });

  it("supports zoom in, zoom out, pan, and reset via toolbar buttons", async ({
    user,
  }) => {
    const { getByTestId } = render(MermaidViewer, {
      code: "graph LR\n  A --> B",
    });

    const toolbar = getByTestId("mermaid-toolbar");
    const content = getByTestId("mermaid-content");

    expect(content.style.transform).toContain("translate(0px, 0px) scale(1)");

    // Zoom in
    const zoomInBtn = toolbar.querySelector(
      '[aria-label="확대"]',
    ) as HTMLButtonElement;
    await user.click(zoomInBtn);
    expect(content.style.transform).toContain("scale(1.25)");

    // Zoom out
    const zoomOutBtn = toolbar.querySelector(
      '[aria-label="축소"]',
    ) as HTMLButtonElement;
    await user.click(zoomOutBtn);
    expect(content.style.transform).toContain("scale(1)");

    // Pan buttons
    const upBtn = toolbar.querySelector(
      '[aria-label="위로 이동"]',
    ) as HTMLButtonElement;
    const leftBtn = toolbar.querySelector(
      '[aria-label="왼쪽으로 이동"]',
    ) as HTMLButtonElement;
    await user.click(upBtn);
    await user.click(leftBtn);
    expect(content.style.transform).toContain("translate(50px, 50px)");

    const downBtn = toolbar.querySelector(
      '[aria-label="아래로 이동"]',
    ) as HTMLButtonElement;
    const rightBtn = toolbar.querySelector(
      '[aria-label="오른쪽으로 이동"]',
    ) as HTMLButtonElement;
    await user.click(downBtn);
    await user.click(rightBtn);
    expect(content.style.transform).toContain("translate(0px, 0px)");

    // Pan and then Reset
    await user.click(upBtn);
    await user.click(zoomInBtn);
    const resetBtn = toolbar.querySelector(
      '[aria-label="초기화"]',
    ) as HTMLButtonElement;
    await user.click(resetBtn);
    expect(content.style.transform).toContain("translate(0px, 0px) scale(1)");
  });

  it("supports pointer drag to pan the diagram", async () => {
    const { getByTestId } = render(MermaidViewer, {
      code: "graph LR\n  A --> B",
    });

    const canvas = getByTestId("mermaid-canvas");
    const content = getByTestId("mermaid-content");

    await fireEvent.pointerDown(canvas, {
      button: 0,
      pointerId: 1,
      clientX: 100,
      clientY: 100,
    });
    await fireEvent.pointerMove(canvas, {
      pointerId: 1,
      clientX: 140,
      clientY: 160,
    });
    await fireEvent.pointerUp(canvas, {
      pointerId: 1,
    });

    expect(content.style.transform).toContain("translate(40px, 60px)");
  });

  it("opens and closes modal and supports modal zoom/pan controls", async ({
    user,
  }) => {
    const { getByTestId } = render(MermaidViewer, {
      code: "graph LR\n  A --> B",
    });

    await waitFor(() => {
      expect(getByTestId("mock-mermaid-svg")).toBeTruthy();
    });

    const modal = getByTestId("mermaid-modal") as HTMLDialogElement;
    modal.showModal = vi.fn(() => {
      modal.setAttribute("open", "");
    });
    modal.close = vi.fn(() => {
      modal.removeAttribute("open");
    });

    const toolbar = getByTestId("mermaid-toolbar");
    const expandBtn = toolbar.querySelector(
      '[aria-label="크게 보기"]',
    ) as HTMLButtonElement;
    await user.click(expandBtn);

    expect(modal.showModal).toHaveBeenCalled();

    await waitFor(() => {
      expect(
        modal.querySelector('[data-testid="mermaid-canvas"]'),
      ).toBeTruthy();
    });

    const modalContent = modal.querySelector(
      '[data-testid="mermaid-content"]',
    ) as HTMLElement;
    const modalCanvas = modal.querySelector(
      '[data-testid="mermaid-canvas"]',
    ) as HTMLElement;

    // Wheel zoom in modal
    await fireEvent.wheel(modalCanvas, { deltaY: -100 });
    expect(modalContent.style.transform).toContain("scale(1.25)");

    await fireEvent.wheel(modalCanvas, { deltaY: 100 });
    expect(modalContent.style.transform).toContain("scale(1)");

    // Close modal
    const closeBtn = modal.querySelector(
      '[aria-label="닫기"]',
    ) as HTMLButtonElement;
    await user.click(closeBtn);
    expect(modal.close).toHaveBeenCalled();
  });
});
