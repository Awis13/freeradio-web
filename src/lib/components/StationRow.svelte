<script lang="ts">
	import type { Tenant } from '$lib/types';
	import { apiFetch, getTenantDomain } from '$lib/api/client';

	let {
		tenant,
		onupdate
	}: {
		tenant: Tenant;
		onupdate?: () => void;
	} = $props();

	let actionLoading = $state(false);
	let actionError = $state('');
	let confirmAction = $state<'delete' | 'suspend' | null>(null);

	const statusColor: Record<string, string> = {
		active: 'var(--accent-color)',
		provisioning: '#ffb43c',
		pending: 'var(--color-text-dim)',
		suspended: '#ff8c00',
		error: '#ff4444',
		deleting: '#666',
		deleted: '#666'
	};

	const statusLabel: Record<string, string> = {
		active: 'ACTIVE',
		provisioning: 'PROVISIONING',
		pending: 'PENDING',
		suspended: 'SUSPENDED',
		error: 'ERROR',
		deleting: 'DELETING',
		deleted: 'DELETED'
	};

	async function openDashboard() {
		actionLoading = true;
		actionError = '';
		try {
			const res = await apiFetch<{ url: string }>(`/api/v1/user/tenants/${tenant.id}/sso-token`, {
				method: 'POST'
			});
			window.location.href = res.url;
		} catch (e) {
			actionError = e instanceof Error ? e.message : 'Failed to open dashboard';
			actionLoading = false;
		}
	}

	async function suspendTenant() {
		confirmAction = null;
		actionLoading = true;
		actionError = '';
		try {
			await apiFetch(`/api/v1/user/tenants/${tenant.id}/suspend`, { method: 'POST' });
			onupdate?.();
		} catch (e) {
			actionError = e instanceof Error ? e.message : 'Failed to suspend';
		}
		actionLoading = false;
	}

	async function resumeTenant() {
		actionLoading = true;
		actionError = '';
		try {
			await apiFetch(`/api/v1/user/tenants/${tenant.id}/resume`, { method: 'POST' });
			onupdate?.();
		} catch (e) {
			actionError = e instanceof Error ? e.message : 'Failed to resume';
		}
		actionLoading = false;
	}

	async function deleteTenant() {
		confirmAction = null;
		actionLoading = true;
		actionError = '';
		try {
			await apiFetch(`/api/v1/user/tenants/${tenant.id}`, { method: 'DELETE' });
			onupdate?.();
		} catch (e) {
			actionError = e instanceof Error ? e.message : 'Failed to delete';
		}
		actionLoading = false;
	}
</script>

<div class="row">
	<div class="info">
		<h3 class="name">{tenant.name}</h3>
		<span class="slug">{tenant.subdomain}.{getTenantDomain()}</span>
	</div>

	<div class="status">
		<span class="dot" style:background={statusColor[tenant.status] ?? 'var(--color-text-dim)'}></span>
		<span class="status-text">{statusLabel[tenant.status] ?? tenant.status.toUpperCase()}</span>
	</div>

	<div class="actions">
		{#if actionLoading}
			<span class="wait">Working...</span>
		{:else if tenant.status === 'active'}
			<button class="action-btn action-primary" onclick={openDashboard}>Open Dashboard</button>
			<button class="action-btn action-warn" onclick={() => confirmAction = 'suspend'}>Suspend</button>
			<button class="action-btn action-danger" onclick={() => confirmAction = 'delete'}>Delete</button>
		{:else if tenant.status === 'suspended'}
			<button class="action-btn action-primary" onclick={resumeTenant}>Resume</button>
			<button class="action-btn action-danger" onclick={() => confirmAction = 'delete'}>Delete</button>
		{:else if tenant.status === 'provisioning'}
			<span class="wait">Setting up...</span>
		{:else if tenant.status === 'error'}
			<span class="err" title={tenant.error_message ?? ''}>Failed</span>
			<button class="action-btn action-danger" onclick={() => confirmAction = 'delete'}>Delete</button>
		{:else if tenant.status === 'deleting'}
			<span class="wait">Deleting...</span>
		{/if}
	</div>
</div>

{#if actionError}
	<div class="error-bar">
		<span>{actionError}</span>
		<button class="dismiss" onclick={() => actionError = ''}>dismiss</button>
	</div>
{/if}

{#if confirmAction}
	<div class="confirm-bar">
		<span>
			{#if confirmAction === 'delete'}
				Permanently delete <strong>{tenant.name}</strong>? This cannot be undone.
			{:else}
				Suspend <strong>{tenant.name}</strong>? Streaming will stop.
			{/if}
		</span>
		<div class="confirm-actions">
			<button
				class="action-btn {confirmAction === 'delete' ? 'action-danger' : 'action-warn'}"
				onclick={confirmAction === 'delete' ? deleteTenant : suspendTenant}
			>
				{confirmAction === 'delete' ? 'Yes, delete' : 'Yes, suspend'}
			</button>
			<button class="action-btn action-ghost" onclick={() => confirmAction = null}>Cancel</button>
		</div>
	</div>
{/if}

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
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.action-btn {
		padding: 0.375rem 0.75rem;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		background: transparent;
		border: 1px solid;
		border-radius: 2px;
		cursor: pointer;
		transition: all 150ms ease;
		white-space: nowrap;
	}

	.action-primary {
		color: var(--accent-color);
		border-color: var(--accent-color);
	}
	.action-primary:hover {
		background: rgba(var(--accent-rgb), 0.1);
	}

	.action-warn {
		color: #ff8c00;
		border-color: #ff8c00;
	}
	.action-warn:hover {
		background: rgba(255, 140, 0, 0.1);
	}

	.action-danger {
		color: #ff4444;
		border-color: #ff4444;
	}
	.action-danger:hover {
		background: rgba(255, 68, 68, 0.1);
	}

	.action-ghost {
		color: var(--color-text-muted);
		border-color: var(--color-border);
	}
	.action-ghost:hover {
		color: var(--color-text);
		border-color: var(--color-border-light);
	}

	.wait {
		font-size: 0.75rem;
		color: #ffb43c;
	}

	.err {
		font-size: 0.75rem;
		color: #ff4444;
	}

	.error-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem 1rem;
		font-size: 0.75rem;
		color: #ff4444;
		background: rgba(255, 68, 68, 0.05);
		border: 1px solid rgba(255, 68, 68, 0.2);
		border-top: none;
		border-radius: 0 0 0.25rem 0.25rem;
	}

	.dismiss {
		background: none;
		border: none;
		color: #ff4444;
		font-size: 0.6875rem;
		cursor: pointer;
		text-decoration: underline;
	}

	.confirm-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.75rem 1rem;
		font-size: 0.8125rem;
		color: var(--color-text-muted);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-top: none;
		border-radius: 0 0 0.25rem 0.25rem;
	}

	.confirm-actions {
		display: flex;
		gap: 0.5rem;
		flex-shrink: 0;
	}

	@media (max-width: 640px) {
		.row {
			flex-wrap: wrap;
		}

		.slug {
			display: none;
		}

		.actions {
			width: 100%;
			justify-content: flex-end;
		}

		.confirm-bar {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
