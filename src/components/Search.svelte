<script lang="ts">
	import Search from '$components/icon/Search.svelte';

	let searchText: string;

	/**
	 * Search posts.
	 * @param text Search text.
	 */
	function search(text: string) {
		console.debug(`Searching ${text}`);
	}
</script>

<div data-testid="search" {...$$restProps}>
	<div class="flex items-center space-x-2">
		<form class="flex" on:submit|preventDefault>
			<!-- TODO: Should show the search results then user select which page to go, not by button -->
			<button class="absolute ml-[11px] mt-[9px]" on:click={() => search(searchText)}>
				<Search class="h-4 w-4 stroke-gray-400" />
			</button>
			<input
				type="text"
				placeholder="Search"
				bind:value={searchText}
				class="input input-bordered h-8 w-full pl-8 placeholder:font-light md:w-auto"
			/>
		</form>
	</div>
</div>
