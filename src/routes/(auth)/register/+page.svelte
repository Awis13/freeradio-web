<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth.svelte';
	import FormInput from '$lib/components/FormInput.svelte';
	import Button from '$lib/components/Button.svelte';

	let email = $state('');
	let displayName = $state('');
	let password = $state('');
	let passwordError = $state('');

	async function handleSubmit(e: Event) {
		e.preventDefault();
		passwordError = '';
		if (password.length < 12) {
			passwordError = 'Password must be at least 12 characters';
			return;
		}
		try {
			await authStore.register(email, displayName, password);
			goto('/dashboard');
		} catch {
			/* error is set in authStore */
		}
	}
</script>

<svelte:head>
	<title>Register — STUDIO 23</title>
</svelte:head>

<div class="card">
	<h1 class="title">Create Account</h1>
	<p class="subtitle">Start your 24/7 radio station</p>

	<form class="form" onsubmit={handleSubmit}>
		<FormInput
			label="Email"
			name="email"
			type="email"
			bind:value={email}
			placeholder="you@example.com"
			required
		/>

		<FormInput
			label="Display Name"
			name="displayName"
			bind:value={displayName}
			placeholder="DJ Shadow"
			required
		/>

		<FormInput
			label="Password"
			name="password"
			type="password"
			bind:value={password}
			placeholder="••••••••"
			required
		/>

		{#if passwordError}
			<p class="error">{passwordError}</p>
		{/if}

		{#if authStore.error}
			<p class="error">{authStore.error}</p>
		{/if}

		<Button type="submit" disabled={authStore.loading || !email || !displayName || !password}>
			{#if authStore.loading}Creating account...{:else}Create Account{/if}
		</Button>
	</form>

	<p class="alt">
		Already have an account? <a href="/login" class="link">Login</a>
	</p>
</div>

<style>
	.card {
		padding: 2rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 0.25rem;
	}

	.title {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-text);
		margin-bottom: 0.25rem;
	}

	.subtitle {
		font-size: 0.8125rem;
		color: var(--color-text-dim);
		margin-bottom: 1.5rem;
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

	.alt {
		margin-top: 1.25rem;
		text-align: center;
		font-size: 0.8125rem;
		color: var(--color-text-dim);
	}

	.link {
		color: var(--accent-color);
		text-decoration: none;
	}

	.link:hover {
		text-decoration: underline;
	}
</style>
