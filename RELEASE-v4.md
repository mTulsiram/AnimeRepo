# AnimeRepo v4 Release Notes

## v4.0.3 (latest)

- **Anime pages** – Regenerated 40k+ pages with `generate_anime_pages.py` (minimal format, anime-offline-database + language dubs).
- **Generator** – Uses minified JSON by default; `--json`, `--jsonl`, `--limit`, `--chunk-size`; filename sanitization for Windows; no v3 branding.
- **Docs** – `GENERATE-ANIME-PAGES.md` with test run and full regeneration instructions.
- **Language dubs** – Updated `language_dubs.json` (872 English, 49 Hindi); `scripts/parse-dubs-list.js` for parsing dub lists.

## v4.0.2

- **Root index** – Replaced v3 page with new SPA; header shows "AnimeRepo" (no v3). Mobile hamburger menu.
- **Filters** – Year: 1990/2000/2010 = decades, 2020–2024 = single year. Genre/type/status case-insensitive; genre options include Slice of Life, Sports, Mystery.
- **Mobile** – Hamburger nav, touch-friendly targets, safe-area padding, responsive filter grid.

## v4.0.1

- **UI polish** – DM Sans font, updated indigo/violet palette, improved hero subtitle and footer.
- **Cards** – 12px radius, hover shadow, clearer “Where to watch” messaging.
- **README** – Full rewrite: features, data sources, where to watch (legal only), tech stack, quick start.
- **Modal** – “Where to watch & details” section with MAL/AniList/AniDB/Kitsu links + Search Crunchyroll / Find on JustWatch.
- **Footer** – Data & watch links (anime-offline-database, Crunchyroll, JustWatch); “Metadata only; watch via linked legal services.”

## v4.0.0

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

**v4.0.3:** Run `.\release-v4.0.3.ps1` (or use GitHub UI with tag `v4.0.3`).

**v4.0.1:** Run `.\release-v4.0.1.ps1` (or use GitHub UI with tag `v4.0.1`).

**v4.0.0:** Run `.\release-v4.ps1` or create release manually with tag `v4.0.0`.

**Manual:** Open https://github.com/mTulsiram/AnimeRepo/releases/new → choose tag → add title/description → Publish.

## Full automation (build + push + release)

From repo root:

```powershell
.\automate-v4.ps1
```

Runs: build (Bun) → chunked push → optional release creation. For v4.0.1 use single-commit push then `.\release-v4.0.1.ps1`.
