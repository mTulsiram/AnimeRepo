# Create GitHub Release v4.0.1 (manual)

Tag **v4.0.1** is already pushed. Create the release in the GitHub UI:

1. Open: **https://github.com/mTulsiram/AnimeRepo/releases/new?tag=v4.0.1**
2. **Title:** `v4.0.1 - UI polish, README, Where to watch, footer`
3. **Description:** Paste the content from `release-v4.0.1.ps1` (the `$body` variable) or use:

---

## AnimeRepo v4.0.1

### Highlights
- **UI polish** – DM Sans font, updated indigo/violet palette, improved hero and footer.
- **Cards** – 12px radius, hover shadow, clearer messaging.
- **README** – Full rewrite: features, data sources, where to watch (legal only), tech stack.
- **Modal** – "Where to watch & details" with MAL/AniList/AniDB/Kitsu + Search Crunchyroll / Find on JustWatch.
- **Footer** – Data & watch links; "Metadata only; watch via linked legal services."

### Build & deploy
```
cd frontend
bun install
bun run deploy:bun
```

### Links
- **Site:** https://mtulsiram.github.io/AnimeRepo/
- **Repo:** https://github.com/mTulsiram/AnimeRepo

---

4. Click **Publish release**.

---

**Optional:** To refresh the live site with the new UI, run from your machine (with Bun or Node installed):
```powershell
cd frontend
bun run deploy:bun
# or: npm run build && npm run copy-dist
```
Then commit and push any changes to `index.html` and `assets/` if they changed.
