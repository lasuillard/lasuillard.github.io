<script lang="ts">
	import Footer from '$components/Footer.svelte';
	import Header from '$components/Header.svelte';
	import Sidebar from '$components/Sidebar.svelte';
	import '../app.css';
</script>

<div class="min-h-screen">
	<Header class="px-2 border-b border-b-slate-200" />

	<div class="flex flex-wrap lg:flex-nowrap h-full">
		<Sidebar class="ml-4 mt-4 p-3 md:basis-1/4 lg:basis-1/5 grow lg:grow-0 md:shrink-0" />

		<main class="py-24 px-12 min-h-[50vh] md:min-h-[80vh] grow">
			<!-- TODO: Breadcrumbs -->
			<slot />
		</main>
	</div>

	<Footer class="p-6 flex border-t border-t-slate-200" />
</div>
