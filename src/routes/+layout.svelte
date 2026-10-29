<script lang="ts">
  import atomOneDark from "highlight.js/styles/atom-one-dark-reasonable.css?url";
  import atomOneLight from "highlight.js/styles/atom-one-light.css?url";

  import { page } from "$app/state";
  import Footer from "#components/layout/Footer.svelte";
  import Header from "#components/layout/Header.svelte";
  import { titleWithSuffix } from "#lib/meta.js";
  import { currentTheme, Theme } from "#lib/theme.js";
  import { fade } from "svelte/transition";
  import "../app.css";

  let { data, children } = $props();

  let title = $derived(titleWithSuffix(page.data?.meta?.title));
  let highlightStyle = $derived(
    $currentTheme === Theme.Dark ? atomOneDark : atomOneLight,
  );
</script>

<svelte:head>
  <!-- https://github.com/sveltejs/kit/issues/3305 -->
  <title>{title}</title>
  {#if page.data?.meta?.description}
    <meta name="description" content={page.data.meta.description} />
  {/if}
  <link rel="stylesheet" href={highlightStyle} />
</svelte:head>

<div data-testid="layout" class="grid min-h-screen auto-rows-min grid-cols-1">
  <Header bind:currentPath={data.current} />

  <div>
    {#key data.current}
      <main
        class="mx-6 mt-12 md:mx-10 lg:mx-24 lg:mt-20"
        data-testid="main"
        in:fade={{ duration: 150, delay: 150 }}
        out:fade={{ duration: 150 }}
      >
        {@render children?.()}
      </main>
    {/key}
  </div>

  <Footer />
</div>
