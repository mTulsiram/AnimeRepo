# Regenerate anime/*.html pages

All anime detail pages in `anime/` are generated from **anime-offline-database-minified.json** and **language_dubs.json**. To refresh them with current data:

## Quick test (5 pages)

```bash
python generate_anime_pages.py --minimal --limit 5
```

## Full regeneration (~40k pages)

From repo root:

```bash
python generate_anime_pages.py --minimal
```

- Uses **anime-offline-database-minified.json** by default (same source as the index).
- Uses **language_dubs.json** for English/Hindi dubbed labels.
- **--minimal** outputs small HTML + shared `../assets/anime-detail.js` and `../assets/anime-detail.css` (no inline styles, no v3 branding).
- Progress is logged every 5000 pages. Full run can take **15–45 minutes** depending on the machine.

## Options

| Option | Description |
|--------|-------------|
| `--minimal` | Use minimal HTML (recommended). |
| `--json PATH` | Minified JSON file (default: anime-offline-database-minified.json). |
| `--jsonl PATH` | Use JSONL instead of minified JSON. |
| `--limit N` | Generate only first N anime (for testing). |
| `--chunk-size N` | Log progress every N pages (default: 5000). |

## After regenerating

- Commit and push the updated `anime/` folder if you want the site to serve the new pages.
- Ensure `assets/anime-detail.js` and `assets/anime-detail.css` are deployed (from `bun run deploy:bun` in frontend).
