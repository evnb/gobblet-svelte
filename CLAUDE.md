# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

A Svelte + Vite implementation of the Gobblet board game, deployed to GitHub Pages at `/gobblet-svelte/`.

## Commands

```bash
npm run dev      # start dev server at localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the dist/ build locally
```

Node 20.17 is in use — Vite 8+ requires 20.19+, so stay on Vite 5.

## Architecture

Game logic lives in `src/lib/gameStore.js` as a Svelte writable store. Components are purely presentational — they read from the store and dispatch actions back to it.

**Components:**
- `gameStore.js` — all state (`board`, `reserve`, `current`, `selected`, `winner`), move logic, win detection, and a `validTargets` derived store
- `Piece.svelte` — renders a single radial-gradient circle sized by piece level (1–4)
- `Cell.svelte` — one board square; reads `validTargets` to show placement highlights
- `Reserve.svelte` — a player's 3 off-board piece stacks
- `App.svelte` — top-level layout, status bar, win overlay, global CSS

## Game Rules

4×4 board, two players (Red / Blue). Each player has 3 stacks of 4 nested pieces (sizes 1–4, largest on top in reserve). A piece can be placed on any empty cell or on a smaller piece (gobbling). Moving a board piece is allowed. Four in a row (row, column, diagonal) wins.

## Conventions

- Dark theme (`#1a1a2e` background), red player `#e94560` / `#ffaabf`, blue player `#4fc3f7` / `#93ddf9`
- Pieces are CSS radial-gradient circles — no SVG or canvas
- All game state mutations go through store actions (`newGame`, `selectReserve`, `clickCell`) — never mutate state directly in components
- No comments unless logic is non-obvious

## Deployment

Pushing to `master` triggers `.github/workflows/deploy.yml`, which runs `npm run build` and publishes `dist/` to GitHub Pages. The `base: '/gobblet-svelte/'` in `vite.config.js` must stay in sync with the repo name for asset paths to resolve correctly.
