<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import FeatureCard from '$lib/components/FeatureCard.svelte';
	import PricingCard from '$lib/components/PricingCard.svelte';
</script>

<svelte:head>
	<title>STUDIO 23 — Launch Your 24/7 Radio Station</title>
</svelte:head>

<!-- Hero -->
<section class="hero">
	<div class="hero-inner">
		<p class="hero-tag">24/7 AUTOMATED STREAMING</p>
		<h1 class="hero-title">
			Your Radio Station.<br />
			<span class="hero-accent">Always On Air.</span>
		</h1>
		<p class="hero-desc">
			Launch a fully automated streaming radio with beat-synced mixing,
			live video visuals, and multi-platform output. No manual work — just music.
		</p>
		<div class="hero-actions">
			<Button href="/register">Get Started</Button>
			<Button href="/explore" variant="secondary">Explore Stations</Button>
		</div>
	</div>
</section>

<!-- Features -->
<section class="section">
	<div class="section-inner">
		<h2 class="section-title">Everything You Need</h2>
		<p class="section-desc">Professional radio automation in a box. Set it up once, let it run forever.</p>

		<div class="features-grid">
			<FeatureCard
				icon="⚡"
				title="AutoDJ Engine"
				description="BPM-aware mixing with beat-aligned crossfades. Drop your tracks, we handle transitions, normalization, and non-stop playback."
			/>
			<FeatureCard
				icon="🎬"
				title="Video Visuals"
				description="Synchronized video loops transcoded and streamed alongside your audio. Hardware-accelerated 1080p, always."
			/>
			<FeatureCard
				icon="📡"
				title="Multi-Platform"
				description="Stream to YouTube, Kick, and your own HLS endpoint simultaneously. One station, every platform."
			/>
			<FeatureCard
				icon="📊"
				title="Analytics"
				description="Real-time listener counts, play history, BPM tracking, and genre analytics. Know your audience."
			/>
		</div>
	</div>
</section>

<!-- How it works -->
<section class="section section-alt">
	<div class="section-inner">
		<h2 class="section-title">How It Works</h2>
		<div class="steps">
			<div class="step">
				<span class="step-num">01</span>
				<h3 class="step-title">Upload Music</h3>
				<p class="step-desc">Drop your tracks. We analyze BPM, structure, and key for perfect mixing.</p>
			</div>
			<div class="step">
				<span class="step-num">02</span>
				<h3 class="step-title">Configure</h3>
				<p class="step-desc">Set your genre, playlists, schedule, and visual style through the dashboard.</p>
			</div>
			<div class="step">
				<span class="step-num">03</span>
				<h3 class="step-title">Go Live</h3>
				<p class="step-desc">Hit play. Your station streams 24/7 with professional transitions and visuals.</p>
			</div>
		</div>
	</div>
</section>

<!-- Pricing -->
<section class="section">
	<div class="section-inner">
		<h2 class="section-title">Pricing</h2>
		<p class="section-desc">Start free. Scale when you're ready.</p>

		<div class="pricing-grid">
			<PricingCard
				name="Free"
				price="$0"
				priceNote="24h streaming, then 1–2 day cooldown"
				features={[
					'1 platform (YouTube OR Twitch OR Kick)',
					'720p video quality',
					'STUDIO 23 watermark',
					'Basic analytics'
				]}
			/>
			<PricingCard
				name="Starter"
				price="$9/mo"
				href="/register?tier=starter"
				features={[
					'24/7 non-stop streaming',
					'1 platform',
					'720p video quality',
					'No watermark',
					'Email support'
				]}
			/>
			<PricingCard
				name="Pro"
				price="$29/mo"
				highlighted
				href="/register?tier=pro"
				features={[
					'24/7 non-stop streaming',
					'3 platforms simultaneously',
					'1080p video quality',
					'DSP & audio processing',
					'Custom overlays',
					'Full analytics'
				]}
			/>
			<PricingCard
				name="Studio"
				price="$59/mo"
				href="/register?tier=studio"
				features={[
					'Up to 3 radio stations',
					'3 platforms per station',
					'4K video quality',
					'API access',
					'Custom domain',
					'Priority support'
				]}
			/>
		</div>
	</div>
</section>

<!-- Bottom CTA -->
<section class="cta-section">
	<div class="section-inner cta-inner">
		<h2 class="cta-title">Ready to go live?</h2>
		<p class="cta-desc">Create your station in minutes. Free tier — no credit card required.</p>
		<Button href="/register">Create Your Station</Button>
	</div>
</section>

<!-- Footer -->
<footer class="footer">
	<div class="footer-inner">
		<span class="footer-brand glow-accent">STUDIO 23</span>
		<span class="footer-copy">24/7 automated radio platform</span>
	</div>
</footer>

<style>
	/* Hero */
	.hero {
		padding: 6rem 1.5rem 4rem;
		text-align: center;
		background:
			radial-gradient(ellipse at 50% 0%, rgba(var(--accent-rgb), 0.08) 0%, transparent 60%),
			var(--color-bg);
	}

	.hero-inner {
		max-width: 48rem;
		margin: 0 auto;
	}

	.hero-tag {
		font-size: 0.6875rem;
		font-weight: 700;
		letter-spacing: 0.15em;
		color: var(--accent-color);
		margin-bottom: 1.5rem;
	}

	.hero-title {
		font-size: clamp(2rem, 5vw, 3.5rem);
		font-weight: 800;
		line-height: 1.1;
		color: var(--color-text);
		margin-bottom: 1.5rem;
	}

	.hero-accent {
		color: var(--accent-color);
	}

	.hero-desc {
		font-size: 1rem;
		line-height: 1.6;
		color: var(--color-text-muted);
		max-width: 36rem;
		margin: 0 auto 2rem;
	}

	.hero-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	/* Sections */
	.section {
		padding: 5rem 1.5rem;
	}

	.section-alt {
		background: var(--color-surface);
		border-top: 1px solid var(--color-border);
		border-bottom: 1px solid var(--color-border);
	}

	.section-inner {
		max-width: 72rem;
		margin: 0 auto;
	}

	.section-title {
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--color-text);
		text-align: center;
		margin-bottom: 0.75rem;
	}

	.section-desc {
		font-size: 0.9375rem;
		color: var(--color-text-muted);
		text-align: center;
		margin-bottom: 3rem;
	}

	/* Features */
	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.25rem;
	}

	/* Steps */
	.steps {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 2rem;
	}

	.step {
		text-align: center;
	}

	.step-num {
		display: inline-block;
		font-size: 2rem;
		font-weight: 800;
		color: rgba(var(--accent-rgb), 0.2);
		margin-bottom: 0.75rem;
	}

	.step-title {
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-text);
		margin-bottom: 0.5rem;
	}

	.step-desc {
		font-size: 0.8125rem;
		line-height: 1.5;
		color: var(--color-text-muted);
	}

	/* Pricing */
	.pricing-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1.25rem;
		align-items: stretch;
		max-width: 72rem;
		margin-left: auto;
		margin-right: auto;
	}

	@media (max-width: 1024px) {
		.pricing-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 600px) {
		.pricing-grid {
			grid-template-columns: 1fr;
		}
	}

	/* CTA */
	.cta-section {
		padding: 5rem 1.5rem;
		background:
			radial-gradient(ellipse at 50% 100%, rgba(var(--accent-rgb), 0.06) 0%, transparent 60%),
			var(--color-bg);
	}

	.cta-inner {
		text-align: center;
	}

	.cta-title {
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--color-text);
		margin-bottom: 0.75rem;
	}

	.cta-desc {
		font-size: 0.9375rem;
		color: var(--color-text-muted);
		margin-bottom: 2rem;
	}

	/* Footer */
	.footer {
		padding: 2rem 1.5rem;
		border-top: 1px solid var(--color-border);
	}

	.footer-inner {
		max-width: 72rem;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.footer-brand {
		font-size: 0.8125rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		color: var(--accent-color);
	}

	.footer-copy {
		font-size: 0.75rem;
		color: var(--color-text-dim);
	}
</style>
