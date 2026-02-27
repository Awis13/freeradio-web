<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';

	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col">
	<Nav />
	<main class="flex-1">
		{@render children()}
	</main>
</div>
