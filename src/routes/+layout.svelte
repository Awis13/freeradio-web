<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-screen flex-col bg-neutral-950 text-white">
	<nav class="border-b border-neutral-800 px-6 py-3">
		<div class="mx-auto flex max-w-7xl items-center justify-between">
			<a href="/" class="text-lg font-bold tracking-tight">STUDIO 23</a>
			<div class="flex gap-4 text-sm text-neutral-400">
				<a href="/" class="hover:text-white">Explore</a>
				<a href="/login" class="hover:text-white">Login</a>
			</div>
		</div>
	</nav>

	<main class="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
		{@render children()}
	</main>

	<!-- Persistent player bar -->
	<div class="border-t border-neutral-800 bg-neutral-900 px-6 py-3">
		<div class="mx-auto flex max-w-7xl items-center justify-between">
			<span class="text-sm text-neutral-500">No station selected</span>
			<div class="flex items-center gap-3">
				<button class="text-sm text-neutral-400 hover:text-white">Play</button>
			</div>
		</div>
	</div>
</div>
