<script lang="ts">
	let {
		label,
		type = 'text',
		name,
		value = $bindable(''),
		placeholder = '',
		error = '',
		required = false
	}: {
		label: string;
		type?: string;
		name: string;
		value?: string;
		placeholder?: string;
		error?: string;
		required?: boolean;
	} = $props();
</script>

<div class="field">
	<label for={name} class="label">{label}</label>
	<input
		{type}
		id={name}
		{name}
		bind:value
		{placeholder}
		{required}
		class="input"
		class:input-error={!!error}
	/>
	{#if error}
		<p class="error">{error}</p>
	{/if}
</div>

<style>
	.field {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.label {
		font-size: 0.75rem;
		font-weight: 500;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-text-muted);
	}

	.input {
		width: 100%;
		padding: 0.625rem 0.75rem;
		font-family: var(--font-mono);
		font-size: 0.875rem;
		color: var(--color-text);
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: 0.25rem;
		outline: none;
		transition: border-color 150ms ease;
	}

	.input::placeholder {
		color: var(--color-text-dim);
	}

	.input:focus {
		border-color: var(--accent-color);
		box-shadow: 0 0 0 1px rgba(var(--accent-rgb), 0.2);
	}

	.input-error {
		border-color: #ff4444;
	}

	.error {
		font-size: 0.75rem;
		color: #ff4444;
	}
</style>
