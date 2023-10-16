<script lang="ts">
	import Footer from '$components/Footer.svelte';
	import Header from '$components/Header.svelte';
	import Sidebar from '$components/Sidebar.svelte';
	import '../app.css';

	let openSidebar = false;
</script>

<div data-testid="layout" class="grid min-h-screen auto-rows-min grid-cols-1">
	<Header class="sticky top-0 z-[1] bg-base-200" bind:openSidebar />

	<div class="grid grid-flow-row p-3 md:grid-flow-col">
		<!-- NOTE: Bind to internal checkbox to apply CSS with Tailwind CSS easily -->
		<input type="checkbox" bind:checked={openSidebar} class="peer hidden" />
		<Sidebar class="col-span-1 p-3 peer-checked:hidden" />

		<main class="px-3 py-6 md:col-span-3 lg:px-12 lg:py-24 xl:col-span-5" data-testid="main">
			<!-- TODO: Breadcrumbs -->
			<slot />
		</main>
	</div>

	<Footer class="sticky top-[100vh] bg-base-200 px-2 py-4" />
</div>
