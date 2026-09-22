<script lang="ts">
	interface Props {
		[key: string]: any;
	}
	let { ...rest }: Props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	fill="none"
	viewBox="0 0 24 24"
	stroke-width="1.5"
	stroke="currentColor"
	data-testid="heroicons/chevron-left"
	{...rest}
>
	<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
</svg>
