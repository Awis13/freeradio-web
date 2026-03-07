<script lang="ts">
	import { authStore } from '$lib/stores/auth.svelte';
	import ThemeSwitcher from './ThemeSwitcher.svelte';

	let mobileOpen = $state(false);
</script>

<nav class="nav">
	<div class="inner">
		<a href="/" class="logo glow-accent">STUDIO 23</a>

		<button class="mobile-toggle" onclick={() => (mobileOpen = !mobileOpen)}>
			{#if mobileOpen}✕{:else}≡{/if}
		</button>

		<div class="links" class:open={mobileOpen}>
			<a href="/explore" class="link">Explore</a>
			{#if authStore.isAuthenticated}
				<a href="/dashboard" class="link">Dashboard</a>
				<a href="/profile" class="link">Profile</a>
				<button class="link link-btn" onclick={() => { authStore.logout(); window.location.href = '/'; }}>Logout</button>
			{:else}
				<a href="/login" class="link">Login</a>
			{/if}
			<ThemeSwitcher />
		</div>
	</div>
</nav>

<style>
	.nav {
		border-bottom: 1px solid var(--color-border);
		padding: 0 1.5rem;
		background: var(--color-bg);
		position: sticky;
		top: 0;
		z-index: 50;
	}

	.inner {
		max-width: 72rem;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 3.5rem;
	}

	.logo {
		font-size: 1rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		color: var(--accent-color);
		text-decoration: none;
	}

	.links {
		display: flex;
		align-items: center;
		gap: 1.25rem;
	}

	.link {
		font-size: 0.8125rem;
		color: var(--color-text-muted);
		text-decoration: none;
		transition: color 150ms ease;
	}

	.link:hover {
		color: var(--color-text);
	}

	.link-btn {
		background: none;
		border: none;
		padding: 0;
		font-family: var(--font-mono);
		cursor: pointer;
	}

	.mobile-toggle {
		display: none;
		background: none;
		border: 1px solid var(--color-border);
		color: var(--color-text-muted);
		font-size: 1.25rem;
		width: 2rem;
		height: 2rem;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		border-radius: 2px;
	}

	@media (max-width: 640px) {
		.mobile-toggle {
			display: flex;
		}

		.links {
			display: none;
			position: absolute;
			top: 3.5rem;
			left: 0;
			right: 0;
			flex-direction: column;
			padding: 1rem 1.5rem;
			gap: 1rem;
			background: var(--color-bg);
			border-bottom: 1px solid var(--color-border);
			align-items: flex-start;
		}

		.links.open {
			display: flex;
		}
	}
</style>
