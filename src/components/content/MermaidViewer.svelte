<script lang="ts">
  import ArrowPathIcon from "#components/icon/ArrowPath.svelte";
  import ArrowsPointingOutIcon from "#components/icon/ArrowsPointingOut.svelte";
  import ChevronDownIcon from "#components/icon/ChevronDown.svelte";
  import ChevronLeftIcon from "#components/icon/ChevronLeft.svelte";
  import ChevronRightIcon from "#components/icon/ChevronRight.svelte";
  import ChevronUpIcon from "#components/icon/ChevronUp.svelte";
  import MagnifyingGlassMinusIcon from "#components/icon/MagnifyingGlassMinus.svelte";
  import MagnifyingGlassPlusIcon from "#components/icon/MagnifyingGlassPlus.svelte";
  import { currentTheme, Theme } from "#lib/theme.js";
  import { MermaidViewportController } from "./mermaid-viewer.svelte.js";
  import MermaidModal from "./MermaidModal.svelte";

  interface Props {
    code: string;
    expandable?: boolean;
    class?: string;
  }

  let { code, expandable = true, class: className = "" }: Props = $props();

  const instanceId = `mermaid-${Math.random().toString(36).slice(2, 11)}`;

  let svgHtml = $state("");
  let isModalOpen = $state(false);

  const controller = new MermaidViewportController();

  let renderCount = 0;

  $effect(() => {
    const theme = $currentTheme === Theme.Dark ? "dark" : "default";
    const trimmed = code.trim();
    if (!trimmed) return;

    let cancelled = false;
    const currentRender = ++renderCount;

    import("mermaid").then(async ({ default: mermaid }) => {
      try {
        mermaid.initialize({
          startOnLoad: false,
          suppressErrorRendering: true,
          theme,
        });
        const { svg } = await mermaid.render(
          `${instanceId}-${currentRender}`,
          trimmed,
        );
        if (!cancelled) {
          svgHtml = svg;
        }
      } catch (e) {
        console.debug("Mermaid failed to render", e);
      }
    });

    return () => {
      cancelled = true;
    };
  });
</script>

<div
  data-testid="mermaid-viewer"
  class={[
    "group border-base-300 bg-base-100 relative my-6 flex flex-col overflow-hidden rounded-lg border",
    className,
  ]}
>
  <div
    data-testid="mermaid-canvas"
    role="application"
    aria-label="다이어그램 뷰어"
    class="flex min-h-40 w-full flex-1 cursor-grab items-center justify-center overflow-hidden p-4 select-none active:cursor-grabbing"
    onpointerdown={controller.handlePointerDown}
    onpointermove={controller.handlePointerMove}
    onpointerup={controller.handlePointerUp}
    onpointercancel={controller.handlePointerUp}
    onwheel={!expandable ? controller.handleWheel : undefined}
  >
    <div
      data-testid="mermaid-content"
      class="flex h-full w-full items-center justify-center [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-h-full [&_svg]:max-w-full"
      style="transform: {controller.transform}; transform-origin: center center;"
    >
      {#if svgHtml && !isModalOpen}
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html svgHtml}
      {/if}
    </div>
  </div>

  <div
    data-testid="mermaid-toolbar"
    class="bg-base-200/80 border-base-300 absolute right-3 bottom-3 z-10 grid grid-cols-3 gap-1 rounded-lg border p-1 opacity-0 shadow-sm backdrop-blur-xs transition-opacity duration-200 select-none group-hover:opacity-100 focus-within:opacity-100"
  >
    {#if expandable}
      <button
        type="button"
        class="btn btn-ghost btn-xs btn-square"
        aria-label="크게 보기"
        title="크게 보기"
        onclick={() => (isModalOpen = true)}
      >
        <ArrowsPointingOutIcon class="h-4 w-4" />
      </button>
    {:else}
      <div></div>
    {/if}
    <button
      type="button"
      class="btn btn-ghost btn-xs btn-square"
      aria-label="위로 이동"
      title="위로 이동"
      onclick={controller.panUp}
    >
      <ChevronUpIcon class="h-4 w-4" />
    </button>
    <button
      type="button"
      class="btn btn-ghost btn-xs btn-square"
      aria-label="확대"
      title="확대"
      onclick={controller.zoomIn}
    >
      <MagnifyingGlassPlusIcon class="h-4 w-4" />
    </button>

    <button
      type="button"
      class="btn btn-ghost btn-xs btn-square"
      aria-label="왼쪽으로 이동"
      title="왼쪽으로 이동"
      onclick={controller.panLeft}
    >
      <ChevronLeftIcon class="h-4 w-4" />
    </button>
    <button
      type="button"
      class="btn btn-ghost btn-xs btn-square"
      aria-label="초기화"
      title="초기화"
      onclick={controller.reset}
    >
      <ArrowPathIcon class="h-4 w-4" />
    </button>
    <button
      type="button"
      class="btn btn-ghost btn-xs btn-square"
      aria-label="오른쪽으로 이동"
      title="오른쪽으로 이동"
      onclick={controller.panRight}
    >
      <ChevronRightIcon class="h-4 w-4" />
    </button>

    <div></div>
    <button
      type="button"
      class="btn btn-ghost btn-xs btn-square"
      aria-label="아래로 이동"
      title="아래로 이동"
      onclick={controller.panDown}
    >
      <ChevronDownIcon class="h-4 w-4" />
    </button>
    <button
      type="button"
      class="btn btn-ghost btn-xs btn-square"
      aria-label="축소"
      title="축소"
      onclick={controller.zoomOut}
    >
      <MagnifyingGlassMinusIcon class="h-4 w-4" />
    </button>
  </div>

  {#if expandable}
    <MermaidModal {code} bind:open={isModalOpen} />
  {/if}
</div>
