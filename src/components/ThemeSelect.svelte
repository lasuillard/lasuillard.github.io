<script lang="ts">
	import Moon from '$components/icon/Moon.svelte';
	import Sun from '$components/icon/Sun.svelte';
	import { Theme, currentTheme } from '$lib/theme';

	/** Toggle theme between dark and light. */
	function toggleTheme() {
		if (!currentTheme) {
			console.error("Trying to update theme while it's not initailized");
			return;
		}
		currentTheme?.update((theme) => {
			const newTheme = theme === Theme.Dark ? Theme.Light : Theme.Dark;
			console.debug(`Theme changed to ${newTheme}`);
			return newTheme;
		});
	}
</script>

<!-- BUG: False-positive uncovered branch; https://github.com/vitest-dev/vitest/issues/1893 -->
<div data-testid="theme-select" {...$$restProps}>
	<div class="flex items-center space-x-2">
		<div class="join">
			<Sun class="h-6 w-6" />
		</div>
		<div class="flex">
			<input
				data-testid="toggle-input"
				type="checkbox"
				class="toggle"
				checked={$currentTheme === Theme.Dark}
				on:click={toggleTheme}
			/>
		</div>
		<div class="join-item">
			<Moon class="h-6 w-6" />
		</div>
	</div>
</div>
