<script lang="ts">
	const supportedLanguages = [
		{
			code: 'ko',
			name: 'Korean'
		},
		{
			code: 'en',
			name: 'English'
		}
	];

	let currentLanguage = 'ko';

	/**
	 * Set current language.
	 * @param code ISO-639 language code.
	 */
	function setLanguage(code: string) {
		currentLanguage = code;
		console.debug(`Set language to ${code}`);
	}
</script>

<div data-testid="language-select" {...$$restProps}>
	<ul class="menu menu-horizontal z-[1] rounded-box">
		<li>
			<details>
				<summary class="text-base font-light">
					{supportedLanguages.find((lang) => lang.code == currentLanguage)?.name || 'Unknown'}
				</summary>
				<ul class="bg-base-300">
					{#each supportedLanguages as lang}
						<li>
							<button on:click={() => setLanguage(lang.code)}>
								<span class="text-base font-light">{lang.name}</span>
							</button>
						</li>
					{/each}
				</ul>
			</details>
		</li>
	</ul>
</div>
