<script lang="ts">
	import Footer from '$components/Footer.svelte';
	import Header from '$components/Header.svelte';
	import Sidebar from '$components/Sidebar.svelte';
	import '../app.css';
</script>

<div data-testid="layout" class="grid min-h-screen auto-rows-min grid-cols-1">
	<Header class="bg-base-200" />

	<div class="grid grid-cols-1 p-3 md:grid-cols-4 xl:grid-cols-6">
		<!--
      TODO: Collapsible sidebar, 100% for small, otherwise col-span-1
            Because menu button current being used by header, consider floating action button
            in side to click or slide right to open menu
    -->
		<Sidebar class="col-span-1 p-3" />

		<main class="px-3 py-6 md:col-span-3 lg:px-12 lg:py-24 xl:col-span-5">
			<!-- TODO: Breadcrumbs -->
			<slot />
		</main>
	</div>

	<Footer class="sticky top-[100vh] bg-base-200 px-2 py-4" />
</div>
