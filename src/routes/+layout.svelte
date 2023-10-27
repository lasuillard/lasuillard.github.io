<script lang="ts">
	// TODO: Dynamic theme selection; re-render layout based on key
	import 'highlight.js/styles/atom-one-dark-reasonable.css';

	import Footer from '$components/Footer.svelte';
	import Header from '$components/Header.svelte';
	import { fade } from 'svelte/transition';
	import '../app.css';

	export let data;
</script>

<div data-testid="layout" class="grid min-h-screen auto-rows-min grid-cols-1">
	<Header class="sticky top-0 z-[1] bg-base-200" bind:currentPath={data.current} />

	<div>
		{#key data.current}
			<main
				class="px-3 py-6 lg:py-24 lg:pl-6"
				data-testid="main"
				in:fade={{ duration: 150, delay: 150 }}
				out:fade={{ duration: 150 }}
			>
				<!-- TODO: Breadcrumbs -->
				<slot />
			</main>
		{/key}
	</div>

	<Footer class="sticky top-[100vh] mt-60 bg-base-200 px-2 py-4" />
</div>
