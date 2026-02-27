<script lang="ts">
	import { themeStore } from '$lib/stores/theme.svelte';
</script>

<button
	class="switcher"
	onclick={() => themeStore.cycle()}
	title="Switch theme ({themeStore.label})"
>
	<span class="dot"></span>
	<span class="label">{themeStore.label}</span>
</button>

<style>
	.switcher {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.25rem 0.5rem;
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		color: var(--accent-color);
		background: rgba(var(--accent-rgb), 0.08);
		border: 1px solid rgba(var(--accent-rgb), 0.2);
		border-radius: 2px;
		cursor: pointer;
		transition: all 150ms ease;
	}

	.switcher:hover {
		background: rgba(var(--accent-rgb), 0.15);
		border-color: rgba(var(--accent-rgb), 0.4);
	}

	.dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--accent-color);
		box-shadow: 0 0 6px rgba(var(--accent-rgb), 0.6);
	}

	.label {
		line-height: 1;
	}
</style>
