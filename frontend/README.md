# AnimeRepo Frontend (v4)

Vite-based build: **separate CSS/JS**, no inline styles or scripts. Code splitting, lazy loading, and **compressed data export** (Gzip) from the browser.

## Features

- **Index (SPA)**: Grid of anime; click opens a **lightweight modal** with data (no full page load).
- **Download data**: In the modal, "Download data (.txt.gz)" gives a Gzip-compressed text file you can parse (key:value lines).
- **Open full page**: Link to the full anime HTML page in `anime/` (existing or minimal).
- **Anime detail (minimal)**: Generator can output minimal HTML (external `anime-detail.css` + `anime-detail.js` + embedded JSON). Each page has a "Download data (.txt.gz)" button.

## Prerequisites

Use **either** **Bun** ([bun.sh](https://bun.sh)) or **Node.js 18+** and **npm**. If `npm` is not in your PATH (e.g. in some IDEs), open a terminal where Node is installed (e.g. “Node.js command prompt” or VS Code terminal with Node) and run the commands below.

## Setup

**Bun:** `cd frontend` then `bun install`  
**npm:** `cd frontend` then `npm install`

**Local dev:** Copy or symlink the data files into `public/` so fetch works:

- `anime-offline-database-minified.json` → `frontend/public/anime-offline-database-minified.json`
- `language_dubs.json` → `frontend/public/language_dubs.json`

Then: `bun run dev` or `npm run dev`.

## Build & deploy

**Bun:** `cd frontend` then `bun run deploy:bun` (after `bun install`).

**npm:**
```bash
cd frontend
npm run build
npm run deploy
```

**Windows:** Run `build-and-deploy.bat` (npm) or `build-and-deploy-bun.bat` (Bun) from the `frontend` folder.

Output is in `frontend/dist/`. Deploy copies `dist/index.html` and `dist/assets/*` to the repo root and keeps `anime/` unchanged. It also ensures `assets/anime-detail.js` and `assets/anime-detail.css` exist (for minimal anime pages).

## Minimal anime pages

To generate **minimal** anime pages (no inline CSS/JS, small HTML + shared assets):

1. Build the frontend so `assets/anime-detail.js` and `assets/anime-detail.css` exist.
2. Run the generator with `--minimal`:

```bash
python generate_anime_pages.py --minimal --jsonl anime-offline-database.jsonl
```

Each generated file will:

- Link to `../assets/anime-detail.css` and `../assets/anime-detail.js`
- Embed the anime object in `<script type="application/json" id="anime-data">`
- Let the shared script render the page and add "Download data (.txt.gz)".

## Structure

- `src/main.js` – index app entry
- `src/js/data.js` – load data, URL helpers, language dubs
- `src/js/filters.js` – filter logic
- `src/js/modal.js` – anime quick-view modal
- `src/js/export-data.js` – Gzip compress + download (pako)
- `src/css/index.css` – index + modal styles
- `src/anime-detail-entry.js` – entry for anime detail page
- `src/anime-detail-render.js` – render from `#anime-data`
- `src/css/anime-detail.css` – detail page styles

All styling and behavior live in these files; the HTML files contain no inline CSS or JS.
