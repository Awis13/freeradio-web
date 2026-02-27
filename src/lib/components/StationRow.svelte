<script lang="ts">
	import type { Tenant } from '$lib/types';

	let { tenant }: { tenant: Tenant } = $props();

	const statusColor: Record<string, string> = {
		active: 'var(--accent-color)',
		provisioning: '#ffb43c',
		pending: 'var(--color-text-dim)',
		error: '#ff4444',
		deleted: '#666'
	};

	const statusLabel: Record<string, string> = {
		active: 'ACTIVE',
		provisioning: 'PROVISIONING',
		pending: 'PENDING',
		error: 'ERROR',
		deleted: 'DELETED'
	};

	function dashboardUrl(subdomain: string): string {
		return `https://${subdomain}.freeradio.app`;
	}
</script>

<div class="row">
	<div class="info">
		<h3 class="name">{tenant.name}</h3>
		<span class="slug">{tenant.subdomain}.freeradio.app</span>
	</div>

	<div class="status">
		<span class="dot" style:background={statusColor[tenant.status] ?? 'var(--color-text-dim)'}></span>
		<span class="status-text">{statusLabel[tenant.status] ?? tenant.status.toUpperCase()}</span>
	</div>

	<div class="actions">
		{#if tenant.status === 'active'}
			<a href={dashboardUrl(tenant.subdomain)} target="_blank" rel="noopener" class="manage-btn">
				Manage
			</a>
		{:else if tenant.status === 'provisioning'}
			<span class="wait">Setting up...</span>
		{:else if tenant.status === 'error'}
			<span class="err">Failed</span>
		{/if}
	</div>
</div>

<style>
	.row {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 0.25rem;
		transition: border-color 150ms ease;
	}

	.row:hover {
		border-color: var(--color-border-light);
	}

	.info {
		flex: 1;
		min-width: 0;
		display: flex;
		align-items: center;
		gap: 0.625rem;
	}

	.name {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--color-text);
		margin: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.slug {
		font-size: 0.75rem;
		color: var(--color-text-dim);
		white-space: nowrap;
	}

	.status {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		flex-shrink: 0;
	}

	.dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
	}

	.status-text {
		font-size: 0.6875rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		color: var(--color-text-muted);
	}

	.actions {
		flex-shrink: 0;
	}

	.manage-btn {
		padding: 0.375rem 0.75rem;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--accent-color);
		background: transparent;
		border: 1px solid var(--accent-color);
		border-radius: 2px;
		text-decoration: none;
		transition: all 150ms ease;
	}

	.manage-btn:hover {
		background: rgba(var(--accent-rgb), 0.1);
	}

	.wait {
		font-size: 0.75rem;
		color: #ffb43c;
	}

	.err {
		font-size: 0.75rem;
		color: #ff4444;
	}

	@media (max-width: 640px) {
		.row {
			flex-wrap: wrap;
		}

		.slug {
			display: none;
		}
	}
</style>
