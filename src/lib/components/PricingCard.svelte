<script lang="ts">
	let {
		name,
		price,
		features,
		highlighted = false
	}: {
		name: string;
		price: string;
		features: string[];
		highlighted?: boolean;
	} = $props();
</script>

<div class="card" class:highlighted>
	<div class="header">
		<h3 class="name">{name}</h3>
		<div class="price">{price}</div>
	</div>
	<ul class="features">
		{#each features as feature}
			<li class="feature">
				<span class="check">+</span>
				{feature}
			</li>
		{/each}
	</ul>
	<a href="/register" class="cta" class:cta-highlighted={highlighted}>
		Get Started
	</a>
</div>

<style>
	.card {
		padding: 1.5rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 0.25rem;
		display: flex;
		flex-direction: column;
		transition: all 200ms ease;
	}

	.card.highlighted {
		border-color: rgba(var(--accent-rgb), 0.4);
		box-shadow: 0 0 30px rgba(var(--accent-rgb), 0.1);
	}

	.header {
		margin-bottom: 1.5rem;
	}

	.name {
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-text-muted);
		margin-bottom: 0.5rem;
	}

	.highlighted .name {
		color: var(--accent-color);
	}

	.price {
		font-size: 2rem;
		font-weight: 700;
		color: var(--color-text);
	}

	.features {
		list-style: none;
		padding: 0;
		margin: 0 0 1.5rem 0;
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
	}

	.feature {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8125rem;
		color: var(--color-text-muted);
	}

	.check {
		color: var(--accent-color);
		font-weight: 700;
		flex-shrink: 0;
	}

	.cta {
		display: block;
		padding: 0.625rem;
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		text-align: center;
		text-decoration: none;
		color: var(--color-text-muted);
		background: transparent;
		border: 1px solid var(--color-border);
		border-radius: 0.25rem;
		transition: all 150ms ease;
		cursor: pointer;
	}

	.cta:hover {
		color: var(--color-text);
		border-color: var(--color-border-light);
	}

	.cta-highlighted {
		color: #0b0f14;
		background: var(--accent-color);
		border-color: var(--accent-color);
	}

	.cta-highlighted:hover {
		filter: brightness(1.1);
		box-shadow: 0 0 20px rgba(var(--accent-rgb), 0.4);
	}
</style>
