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
	let slug = $state('');
	let slugManual = $state(false);
	let genre = $state('');
	let description = $state('');
	let error = $state('');
	let submitting = $state(false);
	let tenant = $state<Tenant | null>(null);
	let pollTimer: ReturnType<typeof setInterval> | null = null;

	$effect(() => {
		if (!slugManual) {
			slug = name
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

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!name.trim() || !slug.trim()) return;

		submitting = true;
		error = '';

		try {
			const res = await apiFetch<Tenant>('/api/v1/tenants', {
				method: 'POST',
				body: JSON.stringify({ name, slug, genre, description })
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
				const res = await apiFetch<Tenant>(`/api/v1/tenants/${tenantId}`);
				tenant = res;
				if (res.status === 'ready' || res.status === 'error') {
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
			<h1 class="title">{tenant.station_name}</h1>
			<ProvisioningSpinner
				status={tenant.status}
				message={tenant.status === 'provisioning' ? 'Setting up your station...' : tenant.status === 'error' ? 'Something went wrong. Please try again.' : ''}
			/>
			{#if tenant.status === 'ready' && tenant.dashboard_url}
				<div class="ready-actions">
					<Button href={tenant.dashboard_url}>Open Dashboard</Button>
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
				label="Slug (URL)"
				name="slug"
				bind:value={slug}
				placeholder="my-techno-station"
				required
			/>

			<FormInput
				label="Genre"
				name="genre"
				bind:value={genre}
				placeholder="Hard Techno"
			/>

			<div class="field">
				<label for="description" class="field-label">Description</label>
				<textarea
					id="description"
					bind:value={description}
					placeholder="What's your station about?"
					rows="3"
					class="textarea"
				></textarea>
			</div>

			{#if error}
				<p class="error">{error}</p>
			{/if}

			<Button type="submit" disabled={submitting || !name.trim() || !slug.trim()}>
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

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.field-label {
		font-size: 0.75rem;
		font-weight: 500;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-text-muted);
	}

	.textarea {
		width: 100%;
		padding: 0.625rem 0.75rem;
		font-family: var(--font-mono);
		font-size: 0.875rem;
		color: var(--color-text);
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: 0.25rem;
		outline: none;
		resize: vertical;
		transition: border-color 150ms;
	}

	.textarea::placeholder {
		color: var(--color-text-dim);
	}

	.textarea:focus {
		border-color: var(--accent-color);
		box-shadow: 0 0 0 1px rgba(var(--accent-rgb), 0.2);
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
