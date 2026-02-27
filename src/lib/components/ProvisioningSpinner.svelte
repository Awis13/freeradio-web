<script lang="ts">
	let {
		status,
		message = ''
	}: {
		status: 'pending' | 'provisioning' | 'ready' | 'error';
		message?: string;
	} = $props();

	const labels: Record<string, string> = {
		pending: 'Queued',
		provisioning: 'Provisioning',
		ready: 'Ready!',
		error: 'Error'
	};
</script>

<div class="spinner-wrap">
	{#if status === 'pending' || status === 'provisioning'}
		<div class="ring"></div>
	{:else if status === 'ready'}
		<div class="check">✓</div>
	{:else}
		<div class="x-mark">✕</div>
	{/if}

	<span class="label" class:ready={status === 'ready'} class:error={status === 'error'}>
		{labels[status]}
	</span>

	{#if message}
		<p class="msg">{message}</p>
	{/if}
</div>

<style>
	.spinner-wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 2rem;
	}

	.ring {
		width: 3rem;
		height: 3rem;
		border: 2px solid var(--color-border);
		border-top-color: var(--accent-color);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	.check {
		width: 3rem;
		height: 3rem;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		color: var(--accent-color);
		border: 2px solid var(--accent-color);
		border-radius: 50%;
	}

	.x-mark {
		width: 3rem;
		height: 3rem;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		color: #ff4444;
		border: 2px solid #ff4444;
		border-radius: 50%;
	}

	.label {
		font-size: 0.8125rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-text-muted);
	}

	.label.ready {
		color: var(--accent-color);
	}

	.label.error {
		color: #ff4444;
	}

	.msg {
		font-size: 0.75rem;
		color: var(--color-text-dim);
		text-align: center;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
