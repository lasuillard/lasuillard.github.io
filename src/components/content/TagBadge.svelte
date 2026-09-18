<script lang="ts">
	import { route } from '$lib/urls';

	interface Props {
		tag: string;
		count?: number;
		selected?: boolean;
		showCount?: boolean;
	}

	let { tag, count, selected = false, showCount = false }: Props = $props();
</script>

<a
	href={selected ? '/blog' : route('/blog', { query: { tag } })}
	class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-all duration-200 {selected
		? 'bg-primary text-primary-content border-primary shadow-sm'
		: 'bg-base-100/50 text-base-content/80 border-base-200 hover:bg-base-200 hover:text-base-content hover:border-base-300'}"
>
	<span>{tag}</span>
	{#if showCount && count !== undefined}
		<span
			class="bg-base-content/10 rounded-full px-1.5 py-0.5 text-xs leading-none font-semibold {selected
				? 'bg-primary-content/20 text-primary-content'
				: 'text-base-content/70'}"
		>
			{count}
		</span>
	{/if}
	{#if selected}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="ml-0.5 h-3.5 w-3.5 opacity-70"
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			<path
				fill-rule="evenodd"
				d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
				clip-rule="evenodd"
			/>
		</svg>
	{/if}
</a>
