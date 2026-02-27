<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';

	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col">
	<Nav />
	<div class="flex flex-1 items-center justify-center px-6">
		<div class="w-full max-w-sm">
			{@render children()}
		</div>
	</div>
</div>
