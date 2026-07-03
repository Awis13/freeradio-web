# STUDIO 23 — Web Frontend

[![CI](https://github.com/Awis13/freeradio-web/actions/workflows/ci.yml/badge.svg)](https://github.com/Awis13/freeradio-web/actions/workflows/ci.yml)
![SvelteKit](https://img.shields.io/badge/SvelteKit-2-FF3E00?logo=svelte&logoColor=white)
![Svelte](https://img.shields.io/badge/Svelte-5-FF3E00?logo=svelte&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

Public-facing web application for the STUDIO 23 streaming platform. Listeners discover stations, browse content, manage subscriptions, and listen to live streams — all from the browser.

![STUDIO 23 Web](docs/studio23-web.png)

## STUDIO 23 Platform

This repository is the **public web frontend** of STUDIO 23 — a multi-tenant streaming SaaS. It is one of three repositories that make up the platform:

- **freeradio-web** (this repo) — SvelteKit frontend that listeners and station owners use in the browser.
- **[controlplane](https://github.com/Awis13/controlplane)** — Go API handling auth, tenants, billing, and LXC provisioning.
- **[freeradio](https://github.com/Awis13/freeradio)** — the per-tenant streaming engine (AutoDJ, video compositing, HLS/RTMP). _Note: this repo may be private for a few more hours — it is being published in the same sweep._

```mermaid
flowchart TD
    U[User browser] --> W[freeradio-web · SvelteKit :5173/:3000]
    W -->|/api/v1/* cookie+JWT| CP[controlplane · Go API :8085]
    CP --> PG[(Postgres 17)]
    CP -->|provision LXC| PX[Proxmox VE]
    PX -->|deploy stack| FR[freeradio tenant]
    CP -->|WireGuard mesh 10.10.0.0/24| FR
    CP -->|poll :80/api/status| FR
    CP -. dynamic routing .-> CADDY[Caddy]
    CP -. tier billing .-> STRIPE[Stripe]
    subgraph TENANT[freeradio tenant stack]
      DASH[dashboard :9090 Node+WS+HLS]
      ICE[Icecast :8000]
      LIQ[Liquidsoap :7000 BPM AutoDJ]
      FF[FFmpeg streamer]
      RTMP[nginx-rtmp :1935 OBS]
      LIQ --> ICE --> FF
      RTMP --> FF
    end
    FR --- TENANT
    FF -->|HLS| W
    FF -->|RTMP| EXT[YouTube / Twitch / Kick]
```

## What This Demonstrates

| Skill | How it shows up here |
|-------|----------------------|
| SvelteKit 2 / Svelte 5 | Full-stack frontend built on runes, route groups, and the Node adapter |
| Authentication | httpOnly-cookie JWT auth with silent token refresh on 401 |
| Payments | Stripe Checkout + Customer Portal integration for tier upgrades |
| Live media | HLS.js playback with a persistent player bar |
| Styling | Tailwind CSS v4 (CSS-first config, no `tailwind.config.js`) |
| UI polish | Multi-theme system with smooth transitions across six themes |

## Screenshots

| Landing | Explore | Login |
|---------|---------|-------|
| ![Landing](screenshots/neon-landing.png) | ![Explore](screenshots/neon-explore.png) | ![Login](screenshots/neon-login.png) |

## Architecture

```
┌──────────────────────────────────────────────────┐
│                 SvelteKit App                     │
│                                                   │
│  (marketing)       (auth)          (app)          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  │
│  │ Landing    │  │ Login      │  │ Explore    │  │
│  │ Pricing    │  │ Register   │  │ Station    │  │
│  │            │  │            │  │ Dashboard  │  │
│  │            │  │            │  │ Billing    │  │
│  │            │  │            │  │ Profile    │  │
│  └────────────┘  └────────────┘  └────────────┘  │
│                        │                          │
│               ┌────────▼─────────┐                │
│               │   API Client     │                │
│               │   (apiFetch)     │                │
│               └────────┬─────────┘                │
└────────────────────────┼──────────────────────────┘
                         │ HTTP/JSON
                ┌────────▼─────────┐
                │  Control Plane   │
                │    (Go API)      │
                └──────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | SvelteKit 2 (Svelte 5) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Bundler | Vite 7 |
| Audio | HLS.js (live stream playback) |
| Auth | JWT (access + refresh tokens) |
| Payments | Stripe Checkout + Customer Portal |
| Deployment | Node adapter (Docker / any Node host) |

## Features

- **Station discovery** — Browse live radio stations with real-time listener counts
- **Live audio player** — HLS stream playback with volume control and persistent player bar
- **User authentication** — Email/password with JWT, automatic token refresh, session expiry handling
- **Station management** — Create and manage your own 24/7 radio station
- **Billing & subscriptions** — Stripe-powered tier upgrades (Free → Starter → Pro → Studio)
- **Theme system** — Multiple dark themes with smooth transitions
- **Responsive design** — Mobile-first layout

## Quick Start

```bash
# Install dependencies
npm install

# Configure API endpoint
cp .env.example .env
# Edit .env — set PUBLIC_CP_API_URL to your Control Plane API

# Development
npm run dev

# Production build
npm run build
npm run preview
```

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `PUBLIC_CP_API_URL` | `http://localhost:8085` | Control Plane API URL |
| `PUBLIC_TENANT_DOMAIN` | `localhost` | Base domain for tenant station URLs |

## Project Structure

```
src/
  lib/
    api/
      client.ts           API client with auth, token refresh, error handling
    components/
      Button.svelte       Reusable button (link/button variants)
      FormInput.svelte    Form input with label and validation
      Nav.svelte          Top navigation bar
      PlayerBar.svelte    Persistent audio player
      StationCard.svelte  Station card for explore grid
      PricingCard.svelte  Pricing tier card
      VolumeSlider.svelte Audio volume control
      ThemeSwitcher.svelte Theme picker dropdown
      ...                 10+ components total
    stores/
      auth.svelte.ts      Auth state (login, register, refresh, logout)
      player.svelte.ts    Audio player state (play, pause, volume)
      stations.svelte.ts  Station list with API fetch
      theme.svelte.ts     Theme persistence
    types.ts              TypeScript interfaces
    data/themes.ts        Theme definitions
  routes/
    (marketing)/          Landing page, pricing
    (auth)/               Login, register
    (app)/
      explore/            Station discovery grid
      stations/[slug]/    Individual station page + player
      dashboard/          Station management
      dashboard/billing/  Subscription management (Stripe)
      dashboard/create/   Station creation wizard
      profile/            User profile
```

## Related Projects

| Project | Description |
|---------|-------------|
| [controlplane](https://github.com/Awis13/controlplane) | Go API — auth, tenants, billing, provisioning |
| [freeRadio](https://github.com/Awis13/freeRadio) | Streaming engine — AutoDJ, video compositing, HLS/RTMP |

## License

MIT
