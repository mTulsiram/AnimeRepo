# AnimeRepo

**A free, open-source anime database** with 40,000+ titles. Browse with filters, view details in a lightweight popup, download data as compressed files, and open full detail pages. Runs on GitHub Pages—no backend required.

---

## Features

- **40K+ anime entries** — Metadata from [anime-offline-database](https://github.com/manami-project/anime-offline-database) (MyAnimeList, AniList, AniDB, Kitsu, and more).
- **Advanced filters** — Search by title, filter by language (dub/sub), type, genre, year, and status.
- **Lightweight popup** — Click any anime to open a modal with key info; no full-page load.
- **Download data** — Export a single anime (or the list) as a Gzip-compressed `.txt.gz` file (key:value lines) for parsing or backup.
- **Where to watch** — Each anime links to MyAnimeList, AniList, AniDB, and Kitsu. Use those or legal streaming services (Crunchyroll, etc.) to watch.
- **Responsive** — Works on desktop, tablet, and mobile.
- **Static & fast** — Pure HTML/CSS/JS, built with Vite. Served from GitHub Pages.

---

## Data sources

AnimeRepo does **not** host or stream video. It uses **open data and APIs** for metadata only:

| Source | Purpose |
|--------|--------|
| [anime-offline-database](https://github.com/manami-project/anime-offline-database) | Main dataset: titles, types, episodes, scores, tags, synonyms, poster URLs, and links to MAL/AniList/AniDB/Kitsu. |
| [language_dubs.json](language_dubs.json) | English and Hindi dub tags for filtering. |
| **MyAnimeList / AniList / AniDB / Kitsu** | Linked from each anime for details, reviews, and “where to watch” info. |

For **watching anime**, use the links on each anime page (to MAL, AniList, etc.) or legal streaming services (e.g. Crunchyroll, Funimation, Netflix). This project does not include scraping or embedded streaming.

---

## Where to watch (legal)

We do **not** embed or scrape streams. You can:

1. **Use our links** — Each anime card and detail page links to MyAnimeList, AniList, AniDB, and Kitsu. Those sites often show “Where to watch” or streaming availability.
2. **Use streaming services** — Search the anime title on [Crunchyroll](https://www.crunchyroll.com), [Funimation](https://www.funimation.com), [Netflix](https://www.netflix.com), or [JustWatch](https://www.justwatch.com) to find legal streams.

---

## Tech stack

- **Frontend:** HTML5, CSS3, JavaScript (ES modules)
- **Build:** [Vite](https://vitejs.dev) — bundling, code splitting, minification
- **Package manager:** [Bun](https://bun.sh) or npm
- **Hosting:** GitHub Pages (static)
- **Data:** JSON/JSONL (anime-offline-database format)

---

## Quick start

### 1. Clone and install

```bash
git clone https://github.com/mTulsiram/AnimeRepo.git
cd AnimeRepo/frontend
bun install   # or: npm install
```

### 2. Run locally (optional)

Copy into `frontend/public/`:

- `anime-offline-database-minified.json`
- `language_dubs.json`

Then:

```bash
bun run dev   # or: npm run dev
```

Open http://localhost:5173

### 3. Build and deploy to repo root

From `frontend/`:

```bash
bun run deploy:bun   # or: npm run build && npm run deploy
```

This builds the app and copies `index.html` and `assets/` to the repo root so GitHub Pages serves them.

---

## Project structure

```
AnimeRepo/
├── index.html              # Main app (built)
├── assets/                 # Built JS/CSS
├── anime/                  # Generated anime detail pages (40K+ HTML)
├── anime-offline-database-minified.json
├── language_dubs.json
├── frontend/               # Vite app source
│   ├── src/
│   │   ├── css/            # index.css, anime-detail.css
│   │   ├── js/             # data, filters, modal, export
│   │   ├── main.js
│   │   └── anime-detail-*.js
│   ├── index.html
│   └── package.json
├── generate_anime_pages.py  # Generate anime/*.html from JSONL
└── README.md
```

---

## Scripts

| Script | Description |
|--------|-------------|
| `frontend/build-and-deploy-bun.bat` | Build + copy to root (Bun). |
| `push-v4-chunked.ps1` | Push to GitHub in 3 commits (frontend, assets, rest). |
| `release-v4.ps1` | Create tag and GitHub release (uses `gh` if installed). |
| `automate-v4.ps1` | Build → push → optional release. |

See [DEPLOY-V4.md](DEPLOY-V4.md) for details.

---

## Generating anime pages

To (re)generate the static anime detail pages:

```bash
python generate_anime_pages.py --jsonl anime-offline-database.jsonl
```

Minimal output (small HTML + shared JS/CSS):

```bash
python generate_anime_pages.py --minimal --jsonl anime-offline-database.jsonl
```

Ensure `assets/anime-detail.js` and `assets/anime-detail.css` exist (run the frontend build first).

---

## Contributing

1. Open an [issue](https://github.com/mTulsiram/AnimeRepo/issues) for bugs or ideas.
2. Fork the repo, make changes, then open a pull request.

---

## License

See [LICENSE](LICENSE).

---

## Links

- **Live site:** [https://mtulsiram.github.io/AnimeRepo/](https://mtulsiram.github.io/AnimeRepo/)
- **Repository:** [https://github.com/mTulsiram/AnimeRepo](https://github.com/mTulsiram/AnimeRepo)
- **Releases:** [https://github.com/mTulsiram/AnimeRepo/releases](https://github.com/mTulsiram/AnimeRepo/releases)
- **Data source:** [anime-offline-database](https://github.com/manami-project/anime-offline-database)
