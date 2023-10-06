<script lang="ts">
	import Profile from './Profile.svelte';
</script>

<div data-testid="sidebar" {...$$restProps}>
	<aside>
		<Profile class="ml-3 mt-3 mb-5 md:ml-2 md:mt-2 md:mb-6" />

		<div class="divider" />

		<!-- TODO: List recent posts, categories -->
	</aside>
</div>
