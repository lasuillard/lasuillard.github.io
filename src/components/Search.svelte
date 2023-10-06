<script lang="ts">
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
			<button class="absolute ml-2 mt-2" on:click={() => search(searchText)}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					class="w-4 h-4 stroke-gray-400"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
					/>
				</svg>
			</button>
			<input
				type="text"
				placeholder="Search"
				bind:value={searchText}
				class="input input-bordered w-32 h-8 md:w-auto pl-8"
			/>
		</form>
	</div>
</div>
