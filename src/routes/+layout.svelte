<script lang="ts">
	import Footer from '$components/Footer.svelte';
	import Header from '$components/Header.svelte';
	import Sidebar from '$components/Sidebar.svelte';
	import '../app.css';
</script>

<!-- TODO: Re-design overall layout with grids -->
<div class="min-h-screen grid grid-cols-1">
	<Header class="px-2 border-b border-b-slate-200 flex" />

	<div class="grid grid-cols-none md:grid-cols-4 xl:grid-cols-6 p-3">
		<Sidebar class="p-3 col-span-1" />

		<main
			class="px-3 py-6 lg:py-24 lg:px-12 min-h-[50vh] md:min-h-[80vh] md:col-span-3 xl:col-span-5"
		>
			<!-- TODO: Breadcrumbs -->
			<slot />
		</main>
	</div>

	<Footer class="py-4 px-2 border-t border-t-slate-200" />
</div>
