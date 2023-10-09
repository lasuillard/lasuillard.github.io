<script>
	import { page } from '$app/stores';

	// FIXME: Accepting parameters for testing because mocking store isn't easy
	export let status = $page.status;
	export let message = $page.error?.message || 'Unknown Error';
</script>

<div class="w-full h-full flex justify-center items-center flex-col">
	<h1 class="text-8xl">{status}</h1>
	<p class="text-4xl mt-6">{message}</p>
</div>
