<script lang="ts">
	import { persisted } from '$lib/store';
	import { Theme, setTheme } from '$lib/theme';

	// Detect default theme from OS preference
	const preferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
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
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
				/>
			</svg>
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
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
				/>
			</svg>
		</div>
	</div>
</div>
