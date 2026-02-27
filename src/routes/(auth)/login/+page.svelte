<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth.svelte';
	import FormInput from '$lib/components/FormInput.svelte';
	import Button from '$lib/components/Button.svelte';

	let username = $state('');
	let password = $state('');

	async function handleSubmit(e: Event) {
		e.preventDefault();
		try {
			await authStore.login(username, password);
			goto('/dashboard');
		} catch {
			/* error is set in authStore */
		}
	}
</script>

<svelte:head>
	<title>Login — STUDIO 23</title>
</svelte:head>

<div class="card">
	<h1 class="title">Login</h1>
	<p class="subtitle">Sign in to manage your stations</p>

	<form class="form" onsubmit={handleSubmit}>
		<FormInput
			label="Username"
			name="username"
			bind:value={username}
			placeholder="your_username"
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

		{#if authStore.error}
			<p class="error">{authStore.error}</p>
		{/if}

		<Button type="submit" disabled={authStore.loading || !username || !password}>
			{#if authStore.loading}Signing in...{:else}Sign In{/if}
		</Button>
	</form>

	<p class="alt">
		Don't have an account? <a href="/register" class="link">Register</a>
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
