<script lang="ts">
	let {
		genre,
		active = false,
		onclick
	}: {
		genre: string;
		active?: boolean;
		onclick?: () => void;
	} = $props();
</script>

<button class="tag" class:active {onclick}>
	{genre}
</button>

<style>
	.tag {
		padding: 0.375rem 0.75rem;
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		font-weight: 500;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-text-dim);
		background: transparent;
		border: 1px solid var(--color-border);
		border-radius: 2px;
		cursor: pointer;
		transition: all 150ms ease;
		white-space: nowrap;
	}

	.tag:hover {
		color: var(--color-text-muted);
		border-color: var(--color-border-light);
	}

	.tag.active {
		color: var(--accent-color);
		border-color: var(--accent-color);
		background: rgba(var(--accent-rgb), 0.1);
	}
</style>
