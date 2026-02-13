# Deploy AnimeRepo v4 to GitHub

## Quick reference

| Step | Command / action |
|------|-------------------|
| Build | `cd frontend` → `bun run deploy:bun` (or npm equivalent) |
| Push (chunked) | From repo root: `.\push-v4-chunked.ps1` |
| Create release | `.\release-v4.ps1` or [releases/new](https://github.com/mTulsiram/AnimeRepo/releases/new) |
| Full automate | `.\automate-v4.ps1` (build + push + optional release) |

## 1. Push code in chunks

The script **push-v4-chunked.ps1** does:

1. **Chunk 1:** Commits `frontend/`, `.gitignore`, `generate_anime_pages.py` (Vite source, Bun support, minimal generator).
2. **Chunk 2:** Commits `index.html` and `assets/` (built output from Vite).
3. **Chunk 3:** Commits any other changes (e.g. docs).

Then it runs **one** `git push origin main`. So you get several small commits and a single push.

**Run from repo root (PowerShell):**

```powershell
Set-Location -LiteralPath "c:\Users\tulsiram_methre\OneDrive - S&P Global\Documents\Projects\AnimeRepo"
.\push-v4-chunked.ps1
```

If the path has special characters (e.g. `&`), use `Set-Location -LiteralPath "..."` or `cd` to the folder in Explorer first, then run `.\push-v4-chunked.ps1`.

## 2. Create a new release on GitHub

### A. Using GitHub CLI (if installed)

From repo root:

```powershell
.\release-v4.ps1
```

If `gh` is available, it creates tag **v4.0.0** and the release. If not, it creates the tag locally and prints manual steps.

### B. Manual (browser)

1. Go to **https://github.com/mTulsiram/AnimeRepo/releases/new**.
2. **Tag:** Choose existing `v4.0.0` or type `v4.0.0` and select “Create new tag on publish” from `main`.
3. **Title:** e.g. `v4.0.0 - Vite SPA, Bun support, modal + compressed data export`.
4. **Description:** Copy from **RELEASE-v4.md** or write a short summary.
5. Click **Publish release**.

If you pushed a tag from the script, it will appear in the tag dropdown.

## 3. Automate locally (build + push + release)

From repo root:

```powershell
.\automate-v4.ps1
```

This will:

1. **Build** – `cd frontend` and run `bun run deploy:bun` (needs Bun).
2. **Push** – Run `push-v4-chunked.ps1` (chunked commits + one push).
3. **Release** – Ask “Create GitHub release now? (y/n)”. If yes, runs `release-v4.ps1`.

You can run **automate-v4.ps1** whenever you want to build, push, and optionally tag a release.

## Troubleshooting

- **Push fails / timeout:** Run `git push origin main --verbose`. For very large repos, ensure Git LFS is set up if you use it for `anime/*.html`.
- **“Nothing to commit”:** Everything in that chunk is already committed; the script will continue and push existing commits.
- **Release script:** If `gh` is not installed, install it from https://cli.github.com/ or use the manual browser steps above.
