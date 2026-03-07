<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth.svelte';
	import { apiFetch } from '$lib/api/client';
	import Button from '$lib/components/Button.svelte';
	import type { BillingStatus, TenantBilling } from '$lib/types';

	// Данные о тарифах для карточек апгрейда
	const tierInfo: Record<string, { price: string; features: string[] }> = {
		starter: {
			price: '$9/mo',
			features: [
				'24/7 non-stop streaming',
				'1 platform',
				'720p video quality',
				'No watermark',
				'Email support',
				'Unlimited encrypted S3 storage'
			]
		},
		pro: {
			price: '$29/mo',
			features: [
				'24/7 non-stop streaming',
				'3 platforms simultaneously',
				'1080p video quality',
				'DSP & audio processing',
				'Custom overlays',
				'Full analytics',
				'Unlimited encrypted S3 storage'
			]
		},
		studio: {
			price: '$59/mo',
			features: [
				'Up to 3 radio stations',
				'3 platforms per station',
				'4K video quality',
				'API access',
				'Custom domain',
				'Priority support',
				'Unlimited encrypted S3 storage'
			]
		}
	};

	const tierOrder = ['free', 'starter', 'pro', 'studio'];
	const upgradeTiers = ['starter', 'pro', 'studio'];

	let billing = $state<TenantBilling | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let showTierSelection = $state(false);
	let checkoutLoading = $state<string | null>(null);
	let portalLoading = $state(false);
	let banner = $state<{ type: 'success' | 'cancelled'; message: string } | null>(null);

	// Текущий тарифный уровень (индекс для сравнения)
	let currentTierIndex = $derived(tierOrder.indexOf(billing?.tier ?? 'free'));

	onMount(() => {
		if (!authStore.isAuthenticated) {
			goto('/login');
			return;
		}

		// Проверяем URL-параметры для статуса оплаты
		const params = new URLSearchParams(window.location.search);
		if (params.get('success') === '1') {
			banner = {
				type: 'success',
				message: 'Subscription activated! Your plan will update shortly.'
			};
			// Убираем параметры из URL
			window.history.replaceState({}, '', '/dashboard/billing');
			// Подождём немного и обновим статус (Stripe webhook)
			setTimeout(() => fetchBilling(), 2000);
		} else if (params.get('cancelled') === '1') {
			banner = {
				type: 'cancelled',
				message: 'Checkout cancelled. No changes were made to your subscription.'
			};
			window.history.replaceState({}, '', '/dashboard/billing');
		}

		fetchBilling();
	});

	async function fetchBilling() {
		error = null;
		try {
			const res = await apiFetch<BillingStatus>('/api/v1/billing/status');
			// Берём первый тенант (основной)
			billing = res.tenants?.[0] ?? null;
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load billing info';
		}
		loading = false;
	}

	async function handleCheckout(tier: string) {
		checkoutLoading = tier;
		try {
			const res = await apiFetch<{ url: string }>('/api/v1/billing/checkout', {
				method: 'POST',
				body: JSON.stringify({
					tier,
					success_url: window.location.origin + '/dashboard/billing?success=1',
					cancel_url: window.location.origin + '/dashboard/billing?cancelled=1'
				})
			});
			window.location.href = res.url;
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to start checkout';
			checkoutLoading = null;
		}
	}

	async function handlePortal() {
		portalLoading = true;
		try {
			const res = await apiFetch<{ url: string }>('/api/v1/billing/portal', {
				method: 'POST',
				body: JSON.stringify({
					return_url: window.location.origin + '/dashboard/billing'
				})
			});
			window.location.href = res.url;
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to open billing portal';
			portalLoading = false;
		}
	}

	function getTierBadgeClass(tier: string): string {
		switch (tier) {
			case 'starter': return 'badge-starter';
			case 'pro': return 'badge-pro';
			case 'studio': return 'badge-studio';
			default: return 'badge-free';
		}
	}

	function dismissBanner() {
		banner = null;
	}
</script>

<svelte:head>
	<title>Billing — STUDIO 23</title>
</svelte:head>

<div class="page">
	<h1 class="title">Billing</h1>

	<!-- Баннер успеха/отмены -->
	{#if banner}
		<div class="banner" class:banner-success={banner.type === 'success'} class:banner-cancelled={banner.type === 'cancelled'}>
			<span>{banner.message}</span>
			<button class="banner-close" onclick={dismissBanner}>x</button>
		</div>
	{/if}

	{#if loading}
		<div class="loading">
			<div class="spinner"></div>
		</div>
	{:else if error && !billing}
		<div class="empty">
			<h2 class="empty-title">Failed to load billing</h2>
			<p class="empty-desc">{error}</p>
			<Button onclick={() => { error = null; loading = true; fetchBilling(); }}>Retry</Button>
		</div>
	{:else if !billing}
		<div class="empty">
			<h2 class="empty-title">No active subscription</h2>
			<p class="empty-desc">Create a station first to manage your billing.</p>
			<Button href="/dashboard/create">Create Station</Button>
		</div>
	{:else}
		<!-- Текущий план -->
		<section class="section">
			<h2 class="section-title">Current Plan</h2>
			<div class="plan-card">
				<div class="plan-header">
					<div class="plan-name-row">
						<span class="plan-name">{billing.tenant_name}</span>
						<span class="badge {getTierBadgeClass(billing.tier)}">{billing.tier}</span>
					</div>
					{#if billing.tier !== 'free'}
						<span class="plan-price">{tierInfo[billing.tier]?.price ?? ''}</span>
					{:else}
						<span class="plan-price">$0</span>
					{/if}
				</div>

				<div class="limits-grid">
					<div class="limit-item">
						<span class="limit-label">Stations</span>
						<span class="limit-value">{billing.limits.max_stations}</span>
					</div>
					<div class="limit-item">
						<span class="limit-label">Platforms</span>
						<span class="limit-value">{billing.limits.max_platforms}</span>
					</div>
					<div class="limit-item">
						<span class="limit-label">Quality</span>
						<span class="limit-value">{billing.limits.max_quality}</span>
					</div>
					<div class="limit-item">
						<span class="limit-label">Watermark</span>
						<span class="limit-value">{billing.limits.watermark ? 'Yes' : 'None'}</span>
					</div>
					<div class="limit-item">
						<span class="limit-label">DSP</span>
						<span class="limit-value">{billing.limits.dsp ? 'Enabled' : 'No'}</span>
					</div>
					<div class="limit-item">
						<span class="limit-label">Overlays</span>
						<span class="limit-value">{billing.limits.custom_overlays ? 'Custom' : 'No'}</span>
					</div>
					<div class="limit-item">
						<span class="limit-label">Analytics</span>
						<span class="limit-value">{billing.limits.analytics}</span>
					</div>
					<div class="limit-item">
						<span class="limit-label">Storage</span>
						<span class="limit-value storage-highlight">{billing.limits.storage}</span>
					</div>
				</div>

				{#if error}
					<p class="inline-error">{error}</p>
				{/if}

				<div class="plan-actions">
					{#if billing.tier === 'free'}
						<Button onclick={() => { showTierSelection = true; }}>Upgrade</Button>
					{:else}
						<Button onclick={handlePortal} disabled={portalLoading}>
							{#if portalLoading}Loading...{:else}Manage Subscription{/if}
						</Button>
						<Button variant="secondary" onclick={() => { showTierSelection = true; }}>
							Change Plan
						</Button>
					{/if}
				</div>
			</div>
		</section>

		<!-- Выбор тарифа -->
		{#if showTierSelection}
			<section class="section">
				<div class="tier-header">
					<h2 class="section-title">
						{billing.tier === 'free' ? 'Choose a Plan' : 'Change Plan'}
					</h2>
					<button class="close-btn" onclick={() => { showTierSelection = false; }}>x</button>
				</div>

				<div class="tier-grid">
					{#each upgradeTiers as tier}
						{@const info = tierInfo[tier]}
						{@const isCurrent = billing.tier === tier}
						{@const tierIdx = tierOrder.indexOf(tier)}
						<div class="tier-card" class:tier-current={isCurrent} class:tier-highlighted={tier === 'pro'}>
							{#if isCurrent}
								<div class="current-label">Current Plan</div>
							{/if}
							<div class="tier-name">{tier}</div>
							<div class="tier-price">{info.price}</div>
							<ul class="tier-features">
								{#each info.features as feature}
									<li class="tier-feature">
										<span class="check">+</span>
										{feature}
									</li>
								{/each}
							</ul>
							{#if isCurrent}
								<button class="tier-btn tier-btn-disabled" disabled>Current</button>
							{:else}
								<button
									class="tier-btn"
									class:tier-btn-highlighted={tier === 'pro'}
									disabled={checkoutLoading !== null}
									onclick={() => handleCheckout(tier)}
								>
									{#if checkoutLoading === tier}
										Processing...
									{:else if tierIdx > currentTierIndex}
										Upgrade
									{:else}
										Switch
									{/if}
								</button>
							{/if}
						</div>
					{/each}
				</div>
			</section>
		{/if}
	{/if}
</div>

<style>
	.page {
		max-width: 56rem;
	}

	.title {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-text);
		margin-bottom: 2rem;
	}

	/* Баннер */
	.banner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 1rem;
		border-radius: 0.25rem;
		font-size: 0.8125rem;
		margin-bottom: 1.5rem;
	}

	.banner-success {
		background: rgba(34, 197, 94, 0.1);
		border: 1px solid rgba(34, 197, 94, 0.3);
		color: #22c55e;
	}

	.banner-cancelled {
		background: rgba(250, 204, 21, 0.1);
		border: 1px solid rgba(250, 204, 21, 0.3);
		color: #facc15;
	}

	.banner-close {
		background: none;
		border: none;
		color: inherit;
		cursor: pointer;
		font-family: var(--font-mono);
		font-size: 0.875rem;
		opacity: 0.7;
		padding: 0 0.25rem;
	}

	.banner-close:hover {
		opacity: 1;
	}

	/* Секции */
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

	/* Карточка текущего плана */
	.plan-card {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 0.25rem;
		padding: 1.5rem;
	}

	.plan-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.5rem;
	}

	.plan-name-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.plan-name {
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-text);
	}

	.plan-price {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-text);
	}

	/* Бейджи */
	.badge {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 0.1875rem 0.5rem;
		border-radius: 2px;
	}

	.badge-free {
		background: rgba(156, 163, 175, 0.15);
		color: #9ca3af;
	}

	.badge-starter {
		background: rgba(59, 130, 246, 0.15);
		color: #3b82f6;
	}

	.badge-pro {
		background: rgba(var(--accent-rgb), 0.15);
		color: var(--accent-color);
	}

	.badge-studio {
		background: rgba(234, 179, 8, 0.15);
		color: #eab308;
	}

	/* Лимиты */
	.limits-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.limit-item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 0.625rem;
		background: var(--color-bg);
		border-radius: 0.25rem;
	}

	.limit-label {
		font-size: 0.6875rem;
		color: var(--color-text-dim);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.limit-value {
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--color-text);
	}

	.storage-highlight {
		color: var(--accent-color);
	}

	.inline-error {
		font-size: 0.8125rem;
		color: #ff4444;
		margin-bottom: 1rem;
	}

	.plan-actions {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	/* Выбор тарифа */
	.tier-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tier-header .section-title {
		border-bottom: none;
		margin-bottom: 0;
		padding-bottom: 0;
	}

	.close-btn {
		background: none;
		border: 1px solid var(--color-border);
		color: var(--color-text-muted);
		cursor: pointer;
		font-family: var(--font-mono);
		font-size: 0.875rem;
		width: 1.75rem;
		height: 1.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 2px;
		margin-bottom: 1rem;
	}

	.close-btn:hover {
		color: var(--color-text);
		border-color: var(--color-border-light);
	}

	.tier-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.25rem;
		margin-top: 1rem;
	}

	.tier-card {
		padding: 1.5rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 0.25rem;
		display: flex;
		flex-direction: column;
		position: relative;
		transition: all 200ms ease;
	}

	.tier-card.tier-highlighted {
		border-color: rgba(var(--accent-rgb), 0.4);
		box-shadow: 0 0 30px rgba(var(--accent-rgb), 0.1);
	}

	.tier-card.tier-current {
		opacity: 0.6;
	}

	.current-label {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--accent-color);
		margin-bottom: 0.5rem;
	}

	.tier-name {
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-text-muted);
		margin-bottom: 0.5rem;
	}

	.tier-highlighted .tier-name {
		color: var(--accent-color);
	}

	.tier-price {
		font-size: 2rem;
		font-weight: 700;
		color: var(--color-text);
		margin-bottom: 1.5rem;
	}

	.tier-features {
		list-style: none;
		padding: 0;
		margin: 0 0 1.5rem 0;
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
	}

	.tier-feature {
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

	.tier-btn {
		display: block;
		width: 100%;
		padding: 0.625rem;
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		text-align: center;
		color: var(--color-text-muted);
		background: transparent;
		border: 1px solid var(--color-border);
		border-radius: 0.25rem;
		transition: all 150ms ease;
		cursor: pointer;
	}

	.tier-btn:hover:not(:disabled) {
		color: var(--color-text);
		border-color: var(--color-border-light);
	}

	.tier-btn-highlighted {
		color: #0b0f14;
		background: var(--accent-color);
		border-color: var(--accent-color);
	}

	.tier-btn-highlighted:hover:not(:disabled) {
		filter: brightness(1.1);
		box-shadow: 0 0 20px rgba(var(--accent-rgb), 0.4);
		color: #0b0f14;
	}

	.tier-btn-disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.tier-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	/* Loading / Empty */
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

	@media (max-width: 768px) {
		.tier-grid {
			grid-template-columns: 1fr;
		}

		.plan-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		.limits-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
