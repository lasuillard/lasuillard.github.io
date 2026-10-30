<script lang="ts">
  interface Props {
    refs: HTMLAnchorElement[];
  }

  let { refs }: Props = $props();

  const HIDE_DELAY_MS = 150;
  const POPOVER_MAX_WIDTH = 384;
  const POPOVER_MAX_HEIGHT = 192;
  const POPOVER_OFFSET = 8;
  const VIEWPORT_PADDING = 16;

  let visible = $state(false);
  let footnoteHtml = $state("");
  let top = $state(0);
  let left = $state(0);
  let maxHeight = $state(POPOVER_MAX_HEIGHT);
  let placeAbove = $state(true);

  let hideTimeout: ReturnType<typeof setTimeout> | undefined;

  function clearHideTimer() {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = undefined;
    }
  }

  function scheduleHide() {
    clearHideTimer();
    hideTimeout = setTimeout(() => {
      visible = false;
    }, HIDE_DELAY_MS);
  }

  function extractFootnoteHtml(ref: HTMLAnchorElement): string | null {
    const href = ref.getAttribute("href");
    if (!href || !href.startsWith("#")) return null;

    let id: string;
    try {
      id = decodeURIComponent(href.slice(1));
    } catch {
      return null;
    }

    const fnElement = document.getElementById(id);
    if (!fnElement) return null;

    const clone = fnElement.cloneNode(true) as HTMLElement;
    clone
      .querySelectorAll("[data-footnote-backref]")
      .forEach((el) => el.remove());

    return clone.innerHTML.trim();
  }

  function showForRef(ref: HTMLAnchorElement) {
    clearHideTimer();
    const content = extractFootnoteHtml(ref);
    if (!content) return;

    const rect = ref.getBoundingClientRect();
    const viewportWidth = window.innerWidth || 1_024;
    const viewportHeight = window.innerHeight || 768;

    const spaceAbove = rect.top - VIEWPORT_PADDING - POPOVER_OFFSET;
    const spaceBelow =
      viewportHeight - rect.bottom - VIEWPORT_PADDING - POPOVER_OFFSET;

    placeAbove = spaceAbove >= POPOVER_MAX_HEIGHT || spaceAbove >= spaceBelow;
    top = placeAbove ? rect.top - POPOVER_OFFSET : rect.bottom + POPOVER_OFFSET;
    maxHeight = Math.max(
      0,
      Math.min(POPOVER_MAX_HEIGHT, placeAbove ? spaceAbove : spaceBelow),
    );

    const maxLeft = Math.max(
      VIEWPORT_PADDING,
      viewportWidth - POPOVER_MAX_WIDTH - VIEWPORT_PADDING,
    );
    left = Math.min(Math.max(VIEWPORT_PADDING, rect.left), maxLeft);

    footnoteHtml = content;
    visible = true;
  }

  $effect(() => {
    const cleanups = refs.map((ref) => {
      const onEnter = () => showForRef(ref);
      const onLeave = () => scheduleHide();

      ref.addEventListener("mouseenter", onEnter);
      ref.addEventListener("mouseleave", onLeave);
      ref.addEventListener("focus", onEnter);
      ref.addEventListener("blur", onLeave);

      return () => {
        ref.removeEventListener("mouseenter", onEnter);
        ref.removeEventListener("mouseleave", onLeave);
        ref.removeEventListener("focus", onEnter);
        ref.removeEventListener("blur", onLeave);
      };
    });

    const onScroll = () => {
      if (visible) {
        visible = false;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearHideTimer();
      cleanups.forEach((fn) => fn());
      window.removeEventListener("scroll", onScroll);
    };
  });
</script>

{#if visible && footnoteHtml}
  <div
    data-testid="footnote-preview"
    role="tooltip"
    class={[
      "prose prose-sm bg-base-100 text-base-content border-base-300 fixed z-50 max-w-sm overflow-y-auto rounded-lg border px-4 py-3 wrap-break-word shadow-lg [&_a]:break-all [&_p]:my-0",
      placeAbove && "-translate-y-full",
    ]}
    style="top: {top}px; left: {left}px; max-height: {maxHeight}px;"
    onmouseenter={clearHideTimer}
    onmouseleave={scheduleHide}
  >
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html footnoteHtml}
  </div>
{/if}
