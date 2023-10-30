<script lang="ts">
	// TODO: Dynamic theme selection; re-render layout based on key
	import 'highlight.js/styles/atom-one-dark-reasonable.css';

	import Footer from '$components/layout/Footer.svelte';
	import Header from '$components/layout/Header.svelte';
	import { fade } from 'svelte/transition';
	import '../app.css';

	export let data;
</script>

<div data-testid="layout" class="grid min-h-screen auto-rows-min grid-cols-1">
	<Header class="sticky top-0 z-[1] bg-base-200" bind:currentPath={data.current} />

	<div>
		{#key data.current}
			<main
				class="mx-8 mt-12 lg:mx-24 lg:mt-20"
				data-testid="main"
				in:fade={{ duration: 150, delay: 150 }}
				out:fade={{ duration: 150 }}
			>
				<!-- TODO: Breadcrumbs -->
				<slot />
			</main>
		{/key}
	</div>

	<Footer class="sticky top-[100vh] mt-20 bg-base-200 px-2 py-4 lg:mt-32" />
</div>
