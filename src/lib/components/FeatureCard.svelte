<script lang="ts">
	let {
		icon,
		title,
		description
	}: {
		icon: string;
		title: string;
		description: string;
	} = $props();
</script>

<div class="card">
	<div class="icon-box">{icon}</div>
	<h3 class="title">{title}</h3>
	<p class="desc">{description}</p>
</div>

<style>
	.card {
		padding: 1.5rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 0.25rem;
		transition: all 200ms ease;
	}

	.card:hover {
		border-color: rgba(var(--accent-rgb), 0.3);
		box-shadow: 0 0 20px rgba(var(--accent-rgb), 0.08);
	}

	.icon-box {
		width: 2.5rem;
		height: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.25rem;
		background: rgba(var(--accent-rgb), 0.1);
		border: 1px solid rgba(var(--accent-rgb), 0.2);
		border-radius: 0.25rem;
		margin-bottom: 1rem;
	}

	.title {
		font-size: 0.9375rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		color: var(--color-text);
		margin-bottom: 0.5rem;
	}

	.desc {
		font-size: 0.8125rem;
		line-height: 1.5;
		color: var(--color-text-muted);
	}
</style>
