<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth.svelte';
	import type { Tenant, TenantListResponse } from '$lib/types';
	import { apiFetch } from '$lib/api/client';
	import StationRow from '$lib/components/StationRow.svelte';
	import Button from '$lib/components/Button.svelte';

	let tenants = $state<Tenant[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);

	onMount(() => {
		if (!authStore.isAuthenticated) {
			goto('/login');
			return;
		}
		fetchTenants();
	});

	async function fetchTenants() {
		error = null;
		try {
			const res = await apiFetch<TenantListResponse>('/api/v1/user/tenants');
			tenants = res.items ?? [];
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load stations';
		}
		loading = false;
	}
</script>

<svelte:head>
	<title>Dashboard — STUDIO 23</title>
</svelte:head>

<div class="header">
	<div>
		<h1 class="title">My Stations</h1>
		<p class="subtitle">Manage your radio stations</p>
	</div>
	<Button href="/dashboard/create">Create Station</Button>
</div>

{#if loading}
	<div class="loading">
		<div class="spinner"></div>
	</div>
{:else if error}
	<div class="empty">
		<h2 class="empty-title">Failed to load</h2>
		<p class="empty-desc">{error}</p>
		<Button onclick={() => { error = ''; loading = true; fetchTenants(); }}>Retry</Button>
	</div>
{:else if tenants.length === 0}
	<div class="empty">
		<div class="empty-icon">📡</div>
		<h2 class="empty-title">No stations yet</h2>
		<p class="empty-desc">Create your first radio station and start streaming.</p>
		<Button href="/dashboard/create">Create Your First Station</Button>
	</div>
{:else}
	<div class="list">
		{#each tenants as tenant (tenant.id)}
			<StationRow {tenant} onupdate={fetchTenants} />
		{/each}
	</div>
{/if}

<style>
	.header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.title {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-text);
		margin-bottom: 0.25rem;
	}

	.subtitle {
		font-size: 0.8125rem;
		color: var(--color-text-dim);
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.loading {
		display: flex;
		justify-content: center;
		padding: 4rem 0;
	}

	.spinner {
		width: 2rem;
		height: 2rem;
		border: 2px solid var(--color-border);
		border-top-color: var(--accent-color);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	.empty {
		text-align: center;
		padding: 4rem 0;
	}

	.empty-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.empty-title {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-text);
		margin-bottom: 0.5rem;
	}

	.empty-desc {
		font-size: 0.875rem;
		color: var(--color-text-muted);
		margin-bottom: 1.5rem;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 640px) {
		.header {
			flex-direction: column;
		}
	}
</style>
