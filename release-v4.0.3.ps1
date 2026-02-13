# ============================================
# AnimeRepo v4.0.3 - Create GitHub Release
# Run after pushing. Requires: gh auth login (once).
# ============================================

$ErrorActionPreference = "Stop"
$repoRoot = "c:\Users\tulsiram_methre\OneDrive - S&P Global\Documents\Projects\AnimeRepo"
Set-Location -LiteralPath $repoRoot
$ghExe = "C:\Program Files\GitHub CLI\gh.exe"
if (-not (Test-Path $ghExe)) { $ghExe = "gh" }

$tag = "v4.0.3"
$title = "v4.0.3 - Anime pages refresh (40k+), generator + docs, language dubs"

$body = @"
## AnimeRepo v4.0.3

### Highlights
- **Anime pages** – Regenerated 40k+ pages with minimal format (anime-offline-database + language dubs).
- **Generator** – Uses minified JSON by default; \`--json\`, \`--jsonl\`, \`--limit\`, \`--chunk-size\`; filename sanitization for Windows; no v3 branding.
- **Docs** – \`GENERATE-ANIME-PAGES.md\` with test run and full regeneration instructions.
- **Language dubs** – Updated \`language_dubs.json\` (872 English, 49 Hindi); \`scripts/parse-dubs-list.js\` for parsing dub lists.

### Build & deploy
\`\`\`
cd frontend
bun install
bun run deploy:bun
\`\`\`

### Links
- **Site:** https://mtulsiram.github.io/AnimeRepo/
- **Repo:** https://github.com/mTulsiram/AnimeRepo
"@

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Create GitHub Release: $tag" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Using GitHub CLI to create release..." -ForegroundColor Green
$bodyFile = Join-Path $env:TEMP "animerepo-release-body.md"
$body | Set-Content -Path $bodyFile -Encoding UTF8
& $ghExe release create $tag --title $title --notes-file $bodyFile
Remove-Item $bodyFile -ErrorAction SilentlyContinue
if ($LASTEXITCODE -eq 0) {
    Write-Host "Release created: https://github.com/mTulsiram/AnimeRepo/releases/tag/$tag" -ForegroundColor Green
    exit 0
}
Write-Host "gh release create failed. If you see 'please run: gh auth login', run that first, then run this script again." -ForegroundColor Yellow

Write-Host "GitHub CLI (gh) not found or failed. Creating tag locally." -ForegroundColor Yellow
$tagExists = git tag -l $tag
if (-not $tagExists) {
    git tag -a $tag -m $title
    Write-Host "Tag $tag created. Push with: git push origin $tag" -ForegroundColor Cyan
    git push origin $tag
}
Write-Host ""
Write-Host "Manual: https://github.com/mTulsiram/AnimeRepo/releases/new → tag $tag → paste title/body → Publish" -ForegroundColor White
Write-Host ""
