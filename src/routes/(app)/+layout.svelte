<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import PlayerBar from '$lib/components/PlayerBar.svelte';

	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col">
	<Nav />
	<main class="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
		{@render children()}
	</main>
	<PlayerBar />
</div>
