<script lang="ts">
	import ThemeSelect from '$components/ThemeSelect.svelte';
	import '../app.css';
</script>

<ThemeSelect data-testid="theme-select" class="m-2" />

<slot />
