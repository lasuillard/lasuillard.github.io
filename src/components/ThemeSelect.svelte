<script lang="ts">
	import { browser } from '$app/environment';
	import Moon from '$components/icon/Moon.svelte';
	import Sun from '$components/icon/Sun.svelte';
	import { persisted } from '$lib/store';
	import { Theme, setTheme } from '$lib/theme';

	let preferDark;

	// Detect default theme from OS preference
	// BUG: This runs multiple times if component used multiple times; may move to `hooks.client.ts`
	if (browser) {
		preferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	}
	const themeDefault = preferDark ? Theme.Dark : Theme.Light;
	console.debug(`Detected color scheme preference is ${themeDefault}`);
	console.debug(`Theme will be default to ${themeDefault} if no previous decision exists`);

	// Subscribe to theme changes
	const currentTheme = persisted('theme', themeDefault);
	currentTheme.subscribe((theme) => {
		setTheme(theme);
	});

	/** Toggle theme between dark and light. */
	function toggleTheme() {
		currentTheme.update((theme) => {
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
				checked={$currentTheme === 'dark'}
				on:click={toggleTheme}
			/>
		</div>
		<div class="join-item">
			<Moon class="h-6 w-6" />
		</div>
	</div>
</div>
