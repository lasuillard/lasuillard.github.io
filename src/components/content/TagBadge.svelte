<script lang="ts">
	import { route } from '$lib/urls';
	import XMark from '../icon/XMark.svelte';

	interface Props {
		tag: string;
		count?: number;
		selected?: boolean;
		showCount?: boolean;
	}

	let { tag, count, selected = false, showCount = false }: Props = $props();
</script>

<a
	href={selected || tag === '...' ? '/blog' : route('/blog', { query: { tag } })}
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
		<XMark class="ml-0.5 h-3.5 w-3.5 opacity-70" />
	{/if}
</a>
