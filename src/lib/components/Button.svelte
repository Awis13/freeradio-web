<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		variant = 'primary',
		type = 'button',
		disabled = false,
		href,
		onclick,
		children
	}: {
		variant?: 'primary' | 'secondary' | 'ghost';
		type?: 'button' | 'submit';
		disabled?: boolean;
		href?: string;
		onclick?: (e: Event) => void;
		children: Snippet;
	} = $props();
</script>

{#if href}
	<a {href} class="btn btn-{variant}" class:disabled>
		{@render children()}
	</a>
{:else}
	<button {type} {disabled} {onclick} class="btn btn-{variant}">
		{@render children()}
	</button>
{/if}

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.625rem 1.25rem;
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		border-radius: 0.25rem;
		border: none;
		transition: all 150ms ease;
		cursor: pointer;
		text-decoration: none;
	}

	.btn-primary {
		background: var(--accent-color);
		color: #0b0f14;
	}
	.btn-primary:hover:not(:disabled) {
		filter: brightness(1.1);
		box-shadow: 0 0 24px rgba(var(--accent-rgb), 0.4);
	}

	.btn-secondary {
		background: transparent;
		color: var(--accent-color);
		border: 1px solid var(--accent-color);
	}
	.btn-secondary:hover:not(:disabled) {
		background: rgba(var(--accent-rgb), 0.1);
	}

	.btn-ghost {
		background: transparent;
		color: var(--color-text-muted);
		border: 1px solid transparent;
	}
	.btn-ghost:hover:not(:disabled) {
		color: var(--color-text);
		border-color: var(--color-border-light);
	}

	.btn:disabled,
	.disabled {
		opacity: 0.4;
		cursor: not-allowed;
		pointer-events: none;
	}
</style>
