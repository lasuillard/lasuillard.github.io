<script lang="ts">
	interface Props {
		[key: string]: any
	}

	let { ...rest }: Props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	fill="none"
	viewBox="0 0 24 24"
	stroke="currentColor"
	data-testid="icon/menu"
	{...rest}
>
	<path
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="2"
		d="M4 6h16M4 12h16M4 18h7"
	/>
</svg>
