# CLAUDE.md

## Project Description

Public frontend for STUDIO 23 streaming platform. Listeners use this web app to discover stations, browse content, and listen to live streams.

## Stack

- **SvelteKit** (Svelte 5) with TypeScript
- **Tailwind CSS v4** (via `@tailwindcss/vite` plugin)
- **Vite** dev server and bundler

## Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run check
```

## API

Calls Control Plane API at the URL specified by `VITE_CP_API_URL` env var (defaults to `http://localhost:8080`). API client lives in `src/lib/api/client.ts`.

## Project Structure

```
src/
  lib/
    api/        — API client for Control Plane
    components/ — shared Svelte components
    stores/     — Svelte stores (auth, player, stations)
  routes/
    (app)/      — main app routes (explore, station, profile)
    (auth)/     — auth routes (login, register)
```

## Notes

- Part of the STUDIO 23 platform. See also: `controlplane` (Go API), `freeRadio` (streaming engine).
- Uses Svelte 5 runes (`$props`, `$state`, `$derived`) — not legacy `export let` syntax.
- Tailwind v4 uses CSS-first config via `src/app.css`, not `tailwind.config.js`.
