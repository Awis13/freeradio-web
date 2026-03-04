<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { themeStore } from '$lib/stores/theme.svelte';
	import '$lib/stores/auth.svelte';

	let { children } = $props();

	onMount(() => {
		themeStore.init();
	});
</script>

<svelte:head>
	<title>STUDIO 23</title>
	<meta name="description" content="Launch your 24/7 automated radio station" />
</svelte:head>

{@render children()}
