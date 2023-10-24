<script lang="ts">
	import QRCode from 'qrcode';
	import { onMount } from 'svelte';

	// BUG: `window` is not defined in `.md` files; pass function instead
	export let text: string;
	export let width: number = 128;

	let qrCode: HTMLElement | undefined;

	onMount(() => {
		if (!qrCode) {
			console.error('Canvas for QR Code not defined yet.');
			return;
		}

		QRCode.toCanvas(
			qrCode,
			text,
			{
				width // TODO: Responsive size
			},
			(err) => {
				if (err) {
					console.error(err);
					return;
				}
				console.debug(`QR Code for URL ${window.location.href} generated successfully`);
			}
		);
	});
</script>

<!-- FIXME: mdsvex not able to do this? -->
<div data-testid="qrcode" {...$$restProps}>
	<canvas bind:this={qrCode} class="place-self-end" title={text} />
</div>
