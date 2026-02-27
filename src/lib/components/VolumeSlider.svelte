<script lang="ts">
	let {
		value = $bindable(0.8),
		onchange
	}: {
		value?: number;
		onchange?: (v: number) => void;
	} = $props();

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		value = parseFloat(target.value);
		onchange?.(value);
	}
</script>

<div class="volume">
	<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
		{#if value === 0}
			<path d="M11 5L6 9H2v6h4l5 4V5z" />
			<line x1="23" y1="9" x2="17" y2="15" />
			<line x1="17" y1="9" x2="23" y2="15" />
		{:else if value < 0.5}
			<path d="M11 5L6 9H2v6h4l5 4V5z" />
			<path d="M15.54 8.46a5 5 0 010 7.07" />
		{:else}
			<path d="M11 5L6 9H2v6h4l5 4V5z" />
			<path d="M15.54 8.46a5 5 0 010 7.07" />
			<path d="M19.07 4.93a10 10 0 010 14.14" />
		{/if}
	</svg>
	<input
		type="range"
		min="0"
		max="1"
		step="0.01"
		value={value}
		oninput={handleInput}
		class="slider"
	/>
</div>

<style>
	.volume {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.icon {
		width: 16px;
		height: 16px;
		color: var(--color-text-muted);
		flex-shrink: 0;
	}

	.slider {
		width: 80px;
		height: 4px;
		-webkit-appearance: none;
		appearance: none;
		background: var(--color-border-light);
		border-radius: 2px;
		outline: none;
		cursor: pointer;
	}

	.slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--accent-color);
		cursor: pointer;
		transition: box-shadow 150ms ease;
	}

	.slider::-webkit-slider-thumb:hover {
		box-shadow: 0 0 8px rgba(var(--accent-rgb), 0.5);
	}

	.slider::-moz-range-thumb {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--accent-color);
		border: none;
		cursor: pointer;
	}
</style>
