<script lang="ts">
	import QRCode from 'qrcode';

	interface Props {
		text: string;
		width?: number;
	}

	let { text, width = 128 }: Props = $props();

	let qrCode: HTMLElement | undefined = $state();

	$effect(() => {
		if (!qrCode) {
			console.error('Canvas for QR Code not defined yet.');
			return;
		}

		QRCode.toCanvas(
			qrCode,
			text,
			{
				width
			},
			(err) => {
				if (err) {
					console.error(err);
					return;
				}
				console.debug(`QR Code for URL ${text} generated successfully`);
			}
		);
	});
</script>

<canvas
	bind:this={qrCode}
	class="shrink-0 rounded-xl"
	data-testid="qrcode"
	title={text}
	{width}
	style="width: {width}px; height: {width}px; min-width: {width}px; min-height: {width}px;"
></canvas>
