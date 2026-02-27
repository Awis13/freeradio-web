<script lang="ts">
	let { size = 'sm' }: { size?: 'sm' | 'md' } = $props();
</script>

<div class="indicator" class:md={size === 'md'}>
	<span class="bar"></span>
	<span class="bar"></span>
	<span class="bar"></span>
</div>

<style>
	.indicator {
		display: flex;
		align-items: flex-end;
		gap: 2px;
		height: 12px;
	}

	.indicator.md {
		height: 16px;
		gap: 3px;
	}

	.bar {
		width: 3px;
		background: var(--accent-color);
		border-radius: 1px;
		animation: bounce 1s ease-in-out infinite;
	}

	.md .bar {
		width: 4px;
	}

	.bar:nth-child(1) {
		animation-delay: 0s;
		height: 40%;
	}
	.bar:nth-child(2) {
		animation-delay: 0.15s;
		height: 70%;
	}
	.bar:nth-child(3) {
		animation-delay: 0.3s;
		height: 50%;
	}

	@keyframes bounce {
		0%,
		100% {
			transform: scaleY(0.4);
		}
		50% {
			transform: scaleY(1);
		}
	}
</style>
