<script lang="ts">
  import { page } from "$app/stores";

  interface Props {
    status?: any;
    /* c8 ignore next */
    message?: any;
  }

  let {
    // eslint-disable-next-line svelte/valid-prop-names-in-kit-pages
    status = $page.status,
    // eslint-disable-next-line svelte/valid-prop-names-in-kit-pages
    message = $page.error?.message || "Unknown Error",
  }: Props = $props();
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
  <h1 class="text-8xl">{status}</h1>
  <p class="mt-6 text-4xl">{message}</p>
</div>
