<script lang="ts">
	import Footer from '$components/Footer.svelte';
	import Header from '$components/Header.svelte';
	import Sidebar from '$components/Sidebar.svelte';
	import { fade } from 'svelte/transition';
	import '../app.css';

	export let data;

	let openSidebar = false;
</script>

<div data-testid="layout" class="grid min-h-screen auto-rows-min grid-cols-1">
	<Header class="sticky top-0 z-[1] bg-base-200" bind:openSidebar />

	<div class="grid grid-cols-1 p-3 md:grid-cols-4 xl:grid-cols-6">
		<!-- NOTE: Bind to internal checkbox to apply CSS with Tailwind CSS easily -->
		<input type="checkbox" bind:checked={openSidebar} class="peer hidden" />
		<Sidebar class="col-span-1 p-3 peer-checked:hidden" />

		{#key data.current}
			<main
				class="peer-checked:xl-col-span-6 col-span-3 px-3 py-6 peer-checked:md:col-span-4 lg:py-24 lg:pl-6 xl:col-span-5"
				data-testid="main"
				in:fade={{ duration: 150, delay: 150 }}
				out:fade={{ duration: 150 }}
			>
				<!-- TODO: Breadcrumbs -->
				<slot />
			</main>
		{/key}
	</div>

	<Footer class="sticky top-[100vh] bg-base-200 px-2 py-4" />
</div>
