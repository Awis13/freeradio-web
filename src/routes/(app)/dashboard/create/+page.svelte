<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth.svelte';
	import { apiFetch } from '$lib/api/client';
	import type { Tenant } from '$lib/types';
	import FormInput from '$lib/components/FormInput.svelte';
	import Button from '$lib/components/Button.svelte';
	import ProvisioningSpinner from '$lib/components/ProvisioningSpinner.svelte';

	let name = $state('');
	let subdomain = $state('');
	let subdomainManual = $state(false);
	let error = $state('');
	let submitting = $state(false);
	let tenant = $state<Tenant | null>(null);
	let pollTimer: ReturnType<typeof setInterval> | null = null;

	$effect(() => {
		if (!subdomainManual) {
			subdomain = name
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/^-|-$/g, '');
		}
	});

	onMount(() => {
		if (!authStore.isAuthenticated) {
			goto('/login');
		}
		return () => {
			if (pollTimer) clearInterval(pollTimer);
		};
	});

	function mapStatus(cpStatus: string): 'pending' | 'provisioning' | 'ready' | 'error' {
		if (cpStatus === 'active') return 'ready';
		if (cpStatus === 'provisioning') return 'provisioning';
		if (cpStatus === 'error') return 'error';
		return 'pending';
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!name.trim() || !subdomain.trim()) return;

		submitting = true;
		error = '';

		try {
			const res = await apiFetch<Tenant>('/api/v1/user/tenants', {
				method: 'POST',
				body: JSON.stringify({ name, subdomain })
			});
			tenant = res;
			startPolling(res.id);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to create station';
			submitting = false;
		}
	}

	function startPolling(tenantId: string) {
		pollTimer = setInterval(async () => {
			try {
				const res = await apiFetch<Tenant>(`/api/v1/user/tenants/${tenantId}`);
				tenant = res;
				if (res.status === 'active' || res.status === 'error') {
					if (pollTimer) clearInterval(pollTimer);
				}
			} catch {
				/* keep polling */
			}
		}, 3000);
	}
</script>

<svelte:head>
	<title>Create Station — STUDIO 23</title>
</svelte:head>

<div class="page">
	<a href="/dashboard" class="back">← Back to Dashboard</a>

	{#if tenant}
		<div class="provisioning">
			<h1 class="title">{tenant.name}</h1>
			<ProvisioningSpinner
				status={mapStatus(tenant.status)}
				message={tenant.status === 'provisioning' ? 'Setting up your station...' : tenant.status === 'error' ? 'Something went wrong. Please try again.' : ''}
			/>
			{#if tenant.status === 'active'}
				<div class="ready-actions">
					<Button href={`https://${tenant.subdomain}.freeradio.app`}>Open Dashboard</Button>
					<Button href="/dashboard" variant="secondary">Back to Stations</Button>
				</div>
			{/if}
			{#if tenant.status === 'error'}
				<Button href="/dashboard" variant="secondary">Back to Dashboard</Button>
			{/if}
		</div>
	{:else}
		<h1 class="title">Create Station</h1>
		<p class="subtitle">Set up a new 24/7 radio station.</p>

		<form class="form" onsubmit={handleSubmit}>
			<FormInput
				label="Station Name"
				name="name"
				bind:value={name}
				placeholder="My Techno Station"
				required
				/>

			<FormInput
				label="Subdomain"
				name="subdomain"
				bind:value={subdomain}
				placeholder="my-techno-station"
				required
			/>
			<p class="subdomain-hint">{subdomain ? `${subdomain}.freeradio.app` : 'your-station.freeradio.app'}</p>

			{#if error}
				<p class="error">{error}</p>
			{/if}

			<Button type="submit" disabled={submitting || !name.trim() || !subdomain.trim()}>
				{#if submitting}Creating...{:else}Create Station{/if}
			</Button>
		</form>
	{/if}
</div>

<style>
	.page {
		max-width: 32rem;
	}

	.back {
		display: inline-block;
		font-size: 0.8125rem;
		color: var(--color-text-dim);
		text-decoration: none;
		margin-bottom: 1.5rem;
		transition: color 150ms;
	}

	.back:hover {
		color: var(--color-text-muted);
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
		margin-bottom: 2rem;
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.subdomain-hint {
		font-size: 0.75rem;
		color: var(--color-text-dim);
		margin-top: -0.75rem;
	}

	.error {
		font-size: 0.8125rem;
		color: #ff4444;
	}

	.provisioning {
		text-align: center;
		padding: 2rem 0;
	}

	.provisioning .title {
		margin-bottom: 2rem;
	}

	.ready-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		margin-top: 1.5rem;
	}
</style>
