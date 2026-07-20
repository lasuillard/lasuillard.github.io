<script lang="ts">
	import { currentTheme, Theme } from '$lib/theme';

	let theme = $derived($currentTheme == Theme.Light ? 'github-light' : 'github-dark');
	let container: HTMLDivElement | undefined = $state();

	// eslint-disable-next-line jsdoc/require-jsdoc
	function loadUtterances(node: HTMLDivElement) {
		const script = document.createElement('script');
		script.src = 'https://utteranc.es/client.js';
		script.setAttribute('repo', 'lasuillard/lasuillard.github.io');
		script.setAttribute('issue-term', 'pathname');
		script.setAttribute('label', 'comment');
		script.setAttribute('theme', theme);
		script.setAttribute('crossorigin', 'anonymous');
		script.async = true;
		node.appendChild(script);

		return {
			destroy() {
				node.innerHTML = '';
			}
		};
	}
</script>

{#key theme}
	<div data-testid="utterances" class="w-full" bind:this={container} use:loadUtterances></div>
{/key}

<style lang="postcss">
	@reference "../../app.css";

	:global(.utterances) {
		margin-left: auto;
		margin-right: auto;
		margin-top: 5rem;
		max-width: 100%;
	}
</style>
