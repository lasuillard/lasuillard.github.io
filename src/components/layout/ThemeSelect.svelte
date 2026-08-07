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
<div data-testid="theme-select" class="flex">
	<label class="btn btn-circle btn-ghost swap swap-rotate" aria-label="Theme Selection">
		<input
			data-testid="toggle-input"
			type="checkbox"
			checked={$currentTheme === Theme.Dark}
			onclick={toggleTheme}
		/>
		<Moon class="swap-on h-7 w-7" />
		<Sun class="swap-off h-7 w-7" />
	</label>
</div>
