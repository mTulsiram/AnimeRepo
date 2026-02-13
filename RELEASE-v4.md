# AnimeRepo v4.0.0 Release Notes

## Summary

- **Vite frontend** – All CSS and JS in separate files; no inline styles. Build with Bun or npm.
- **Lightweight modal** – Click an anime to open a popup with data (no full page load).
- **Download data** – Get a Gzip-compressed `.txt.gz` file (key:value lines) from the modal or from minimal anime pages.
- **Open full page** – Link from modal to the full anime HTML page in `anime/`.
- **Bun or npm** – Use `bun install` and `bun run deploy:bun`, or `npm run build` and `npm run deploy`.
- **Minimal anime pages** – Generator supports `--minimal` for small HTML + shared `anime-detail.js`/`.css` and "Download data" on each page.

## Build & deploy (local)

```bash
cd frontend
bun install
bun run deploy:bun
```

Or with npm: `npm run build` then `npm run deploy`.

## Push to GitHub (chunked)

From repo root (PowerShell):

```powershell
.\push-v4-chunked.ps1
```

This makes up to 3 commits (frontend, built assets, remaining) and pushes once.

## Create GitHub release

**Option A – Script (if GitHub CLI is installed):**

```powershell
.\release-v4.ps1
```

**Option B – Manual:**

1. Open https://github.com/mTulsiram/AnimeRepo/releases/new
2. Tag: `v4.0.0` (create from `main` if it doesn’t exist)
3. Title: `v4.0.0 - Vite SPA, Bun support, modal + compressed data export`
4. Paste this file or the summary above as the description
5. Publish release

## Full automation (build + push + release)

From repo root:

```powershell
.\automate-v4.ps1
```

Runs: build (Bun) → chunked push → optional release creation.
