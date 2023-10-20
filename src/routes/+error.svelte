<script>
	import { page } from '$app/stores';

	// NOTE: Accepting as parameters for testing because mocking store isn't easy
	export let status = $page.status;
	export let message = $page.error?.message || 'Unknown Error';
</script>

<div class="flex h-screen">
	<div class="m-auto">
		<h1 class="text-8xl">{status}</h1>
		<p class="mt-6 text-4xl">{message}</p>
	</div>
</div>
