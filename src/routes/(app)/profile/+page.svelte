<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth.svelte';
	import FormInput from '$lib/components/FormInput.svelte';
	import Button from '$lib/components/Button.svelte';

	let oldPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let pwLoading = $state(false);
	let pwError = $state('');
	let pwSuccess = $state(false);

	onMount(() => {
		if (!authStore.isAuthenticated) {
			goto('/login');
		}
	});

	async function handlePasswordChange(e: Event) {
		e.preventDefault();
		pwError = '';
		pwSuccess = false;

		if (newPassword.length < 12) {
			pwError = 'New password must be at least 12 characters';
			return;
		}

		if (newPassword !== confirmPassword) {
			pwError = 'Passwords do not match';
			return;
		}

		pwLoading = true;
		try {
			await authStore.changePassword(oldPassword, newPassword);
			pwSuccess = true;
			oldPassword = '';
			newPassword = '';
			confirmPassword = '';
		} catch (e) {
			pwError = e instanceof Error ? e.message : 'Failed to change password';
		}
		pwLoading = false;
	}
</script>

<svelte:head>
	<title>Profile — STUDIO 23</title>
</svelte:head>

<div class="page">
	<h1 class="title">Profile</h1>

	<section class="section">
		<h2 class="section-title">Account</h2>
		<div class="info-grid">
			<div class="info-row">
				<span class="info-label">Email</span>
				<span class="info-value">{authStore.user?.email ?? '—'}</span>
			</div>
			<div class="info-row">
				<span class="info-label">Display Name</span>
				<span class="info-value">{authStore.user?.display_name ?? '—'}</span>
			</div>
		</div>
	</section>

	<section class="section">
		<h2 class="section-title">Change Password</h2>
		<form class="form" onsubmit={handlePasswordChange}>
			<FormInput
				label="Current Password"
				name="old_password"
				type="password"
				bind:value={oldPassword}
				placeholder="••••••••"
				required
			/>
			<FormInput
				label="New Password"
				name="new_password"
				type="password"
				bind:value={newPassword}
				placeholder="At least 12 characters"
				required
			/>
			<FormInput
				label="Confirm New Password"
				name="confirm_password"
				type="password"
				bind:value={confirmPassword}
				placeholder="••••••••"
				required
			/>

			{#if pwError}
				<p class="error">{pwError}</p>
			{/if}

			{#if pwSuccess}
				<p class="success">Password updated. All other sessions have been signed out.</p>
			{/if}

			<Button
				type="submit"
				disabled={pwLoading || !oldPassword || !newPassword || !confirmPassword}
			>
				{#if pwLoading}Updating...{:else}Update Password{/if}
			</Button>
		</form>
	</section>
</div>

<style>
	.page {
		max-width: 32rem;
	}

	.title {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-text);
		margin-bottom: 2rem;
	}

	.section {
		margin-bottom: 2.5rem;
	}

	.section-title {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--color-border);
	}

	.info-grid {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.info-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.625rem 0;
	}

	.info-label {
		font-size: 0.8125rem;
		color: var(--color-text-dim);
	}

	.info-value {
		font-size: 0.8125rem;
		color: var(--color-text);
		font-weight: 500;
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.error {
		font-size: 0.8125rem;
		color: #ff4444;
	}

	.success {
		font-size: 0.8125rem;
		color: var(--accent-color);
	}
</style>
