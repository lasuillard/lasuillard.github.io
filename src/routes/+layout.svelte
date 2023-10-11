<script lang="ts">
	import Footer from '$components/Footer.svelte';
	import Header from '$components/Header.svelte';
	import Sidebar from '$components/Sidebar.svelte';
	import '../app.css';
</script>

<div class="min-h-screen grid grid-cols-1 auto-rows-min">
	<Header class="bg-base-200" />

	<div class="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-6 p-3">
		<!--
      TODO: Collapsible sidebar, 100% for small, otherwise col-span-1
            Because menu button current being used by header, consider floating action button
            in side to click or slide right to open menu
    -->
		<Sidebar class="p-3 col-span-1" />

		<main class="px-3 py-6 lg:py-24 lg:px-12 md:col-span-3 xl:col-span-5">
			<!-- TODO: Breadcrumbs -->
			<slot />
		</main>
	</div>

	<Footer class="py-4 px-2 sticky top-[100vh] bg-base-200" />
</div>
