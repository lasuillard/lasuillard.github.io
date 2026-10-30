<script lang="ts">
  import FootnotePreview from "#components/content/FootnotePreview.svelte";
  import MermaidViewer from "#components/content/MermaidViewer.svelte";
  import CheckIcon from "#components/icon/Check.svelte";
  import CopyIcon from "#components/icon/Copy.svelte";
  import { mount, onMount, tick, unmount } from "svelte";

  const LANG_MAP: Record<string, string> = {
    javascript: "JS",
    typescript: "TS",
    powershell: "PowerShell",
    svelte: "Svelte",
    html: "HTML",
    css: "CSS",
    json: "JSON",
    bash: "Bash",
    shell: "Shell",
    markdown: "Markdown",
    python: "Python",
    yaml: "YAML",
  };

  let {
    // Parsed front matter and content
    // eslint-disable-next-line no-useless-assignment
    frontMatter = $bindable(undefined),
    content = $bindable(""),
    // Whether the content is ready to be displayed
    ready = $bindable(false),
    // Child elements to render if no content is provided
    children,
  } = $props();

  // Binding wrapper used to obtain input slot contents
  let wrapper: HTMLElement | undefined = $state();

  onMount(async () => {
    if (content) {
      ready = true;
      return;
    }
    ({ content } = await import("#lib/markdown.js").then(({ render }) =>
      render(wrapper?.textContent || ""),
    ));

    console.debug("Content is ready to be displayed.");
    ready = true;
  });

  // Mount Mermaid viewer components
  $effect(() => {
    if (!content || !ready) return;

    // Cancellation flag to prevent stale callback mounting components after cleanup
    let cancelled = false;

    const mountedMermaids: Record<string, any>[] = [];

    // Initialize mermaid diagrams
    tick().then(() => {
      if (cancelled) return;
      const mermaids = document.querySelectorAll("pre.mermaid");
      mermaids.forEach((pre) => {
        const code = pre.textContent || "";
        const target = document.createElement("div");
        pre.replaceWith(target);
        const viewer = mount(MermaidViewer, {
          target,
          props: { code },
        });
        mountedMermaids.push(viewer);
      });
    });

    return () => {
      cancelled = true;
      mountedMermaids.forEach((viewer) => {
        unmount(viewer);
      });
    };
  });

  // Process code blocks whenever content is loaded or changes (supports SPA page navigation)
  $effect(() => {
    if (!content || !ready) return;

    tick().then(() => {
      const pres = document.querySelectorAll("article.prose pre");
      pres.forEach((pre) => {
        // Avoid processing multiple times
        if (pre.parentElement?.classList.contains("code-block-wrapper")) {
          return;
        }
        // Skip mermaid diagrams
        if (pre.classList.contains("mermaid")) {
          return;
        }

        const code = pre.querySelector("code");
        if (!code) return;

        // Create the relative wrapper
        const codeBlockWrapper = document.createElement("div");
        codeBlockWrapper.className = "code-block-wrapper";

        // Insert wrapper before pre, and move pre inside
        pre.parentNode?.insertBefore(codeBlockWrapper, pre);
        codeBlockWrapper.appendChild(pre);

        // Get code language
        let lang = "";
        const langClass = Array.from(code.classList).find((cls) =>
          cls.startsWith("language-"),
        );
        if (langClass) {
          lang = langClass.replace("language-", "");
        }

        // Create badge and copy button container
        const container = document.createElement("div");
        container.className = "code-block-tools";

        // Language Badge
        if (lang) {
          const badge = document.createElement("span");
          badge.className = "code-badge";
          badge.innerText = LANG_MAP[lang.toLowerCase()] || lang;
          container.appendChild(badge);
        }

        // Copy Button
        const copyBtn = document.createElement("button");
        copyBtn.type = "button";
        copyBtn.className = "code-copy-btn";
        copyBtn.setAttribute("aria-label", "Copy code to clipboard");

        let iconComponent = mount(CopyIcon, {
          target: copyBtn,
          props: { class: "h-5 w-5" },
        });

        copyBtn.addEventListener("click", async () => {
          try {
            const lines = code.querySelectorAll(".code-line");
            let text = "";
            if (lines.length > 0) {
              text = Array.from(lines)
                .map((l) => (l as HTMLElement).innerText || l.textContent || "")
                .join("\n");
            } else {
              text = code.innerText || code.textContent || "";
            }

            await navigator.clipboard.writeText(text);

            unmount(iconComponent);
            iconComponent = mount(CheckIcon, {
              target: copyBtn,
              props: { class: "h-5 w-5 text-slate-900" },
            });
            copyBtn.classList.add("copied");
            setTimeout(() => {
              unmount(iconComponent);
              iconComponent = mount(CopyIcon, {
                target: copyBtn,
                props: { class: "h-5 w-5" },
              });
              copyBtn.classList.remove("copied");
            }, 2000);
          } catch (err) {
            console.error("Failed to copy code: ", err);
          }
        });

        container.appendChild(copyBtn);
        codeBlockWrapper.appendChild(container);
      });
    });
  });

  // Initialize footnote hover preview
  $effect(() => {
    if (!content || !ready) return;

    let footnotePreview: Record<string, any> | undefined;
    let footnoteTarget: HTMLElement | undefined;
    let cancelled = false;

    tick().then(() => {
      if (cancelled) return;
      const footnoteRefs = document.querySelectorAll<HTMLAnchorElement>(
        "a[data-footnote-ref]",
      );
      if (footnoteRefs.length > 0) {
        footnoteTarget = document.createElement("div");
        document.body.appendChild(footnoteTarget);
        footnotePreview = mount(FootnotePreview, {
          target: footnoteTarget,
          props: { refs: Array.from(footnoteRefs) },
        });
      }
    });

    return () => {
      cancelled = true;
      if (footnotePreview) {
        unmount(footnotePreview);
      }
      footnoteTarget?.remove();
    };
  });
</script>

{#if content}
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html content}
{:else}
  <div bind:this={wrapper} class="hidden">
    {@render children?.()}
  </div>
{/if}

<style lang="postcss">
  @reference "../../app.css";

  /* Local scoped code block styling using :global */
  :global(.code-block-wrapper) {
    position: relative;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
    border-radius: 0.5rem;
    border: 1px solid transparent;
    background-color: #1e1e2e; /* Cozy dark editor background */
    overflow: hidden;
  }

  :global(.code-block-wrapper pre) {
    margin: 0 !important;
    padding: 0rem !important;
    background-color: transparent !important;
    overflow-x: auto;
  }

  :global(.code-block-wrapper pre code) {
    display: block;
    min-width: 100%;
  }

  :global(.code-line) {
    display: inline-block;
    min-width: 100%;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    margin-left: -0.75rem;
    margin-right: -0.75rem;
    border-left: 4px solid transparent;
  }

  /* Target .code-line elements with a data-line-number attribute to display line numbering */
  :global(.code-line[data-line-number]::before) {
    content: attr(data-line-number);
    display: inline-block;
    width: 1.5rem;
    margin-right: 1rem;
    text-align: right;
    color: #6c7086;
    user-select: none;
  }

  :global(.highlighted-code-line) {
    background-color: rgba(234, 179, 8, 0.1) !important;
    border-left-color: #eab308 !important;
  }

  /* Badge and Copy Button styling */
  :global(.code-block-tools) {
    position: absolute;
    right: 0.75rem;
    top: 0.75rem;
    z-index: 5;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    user-select: none;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }

  :global(.code-block-wrapper:hover .code-block-tools) {
    opacity: 1;
  }

  :global(.code-badge) {
    display: inline-flex;
    align-items: center;
    height: 1.875rem;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background-color: #313244;
    color: #cdd6f4;
  }

  :global(.code-copy-btn) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 1.875rem;
    width: 1.875rem;
    border-radius: 0.25rem;
    padding: 0;
    border: none;
    background-color: #313244;
    color: #a6adc8;
    cursor: pointer;
    transition: all 0.15s ease-in-out;
  }

  :global(.code-copy-btn:hover) {
    background-color: #45475a;
    color: #cdd6f4;
    transform: scale(1.05);
  }

  :global(.code-copy-btn:active) {
    transform: scale(0.95);
  }

  :global(.code-copy-btn.copied) {
    background-color: #a6e3a1;
    color: #11111b;
  }
</style>
