<script lang="ts">
	import Footer from '$components/Footer.svelte';
	import Header from '$components/Header.svelte';
	import Sidebar from '$components/Sidebar.svelte';
	import '../app.css';
</script>

<div class="min-h-screen">
	<Header class="px-6 border-b border-b-slate-200" />

	<div class="flex flex-wrap h-full">
		<Sidebar class="ml-4 mt-4 p-3 w-full md:w-1/4 lg:w-1/5" />

		<main class="flex flex-1 pt-4 px-3 pb-4 min-h-[50vh] md:min-h-[80vh]">
			<slot />
		</main>
	</div>

	<Footer class="p-6 flex border-t border-t-slate-200" />
</div>
