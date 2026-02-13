# ============================================
# AnimeRepo v4 - Create GitHub Release
# Creates tag v4.0.0 and a GitHub release (uses gh CLI if installed).
# ============================================

$ErrorActionPreference = "Stop"
$repoRoot = "c:\Users\tulsiram_methre\OneDrive - S&P Global\Documents\Projects\AnimeRepo"
Set-Location -LiteralPath $repoRoot

$tag = "v4.0.0"
$title = "v4.0.0 - Vite SPA, Bun support, modal + compressed data export"

$body = @"
## AnimeRepo v4.0.0

### Highlights
- **Vite frontend** – Separate CSS/JS, no inline styles; code splitting and modern build.
- **Bun or npm** – Use \`bun install\` and \`bun run deploy:bun\` or npm equivalent.
- **Lightweight modal** – Click an anime to open a popup with data (no full page load).
- **Download data** – Get a Gzip-compressed \`.txt.gz\` file (key:value lines) from the modal or from minimal anime pages.
- **Open full page** – Link from modal to the full anime HTML page in \`anime/\`.
- **Minimal anime pages** – Generator supports \`--minimal\` for small HTML + shared \`anime-detail.js\`/\`.css\`.

### Build & deploy (local)
\`\`\`
cd frontend
bun install
bun run deploy:bun
\`\`\`
Or with npm: \`npm run build\` then \`npm run deploy\`.

### Links
- **Site:** https://mtulsiram.github.io/AnimeRepo/
- **Repo:** https://github.com/mTulsiram/AnimeRepo
"@

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Create GitHub Release: $tag" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Prefer GitHub CLI
$gh = Get-Command gh -ErrorAction SilentlyContinue
if ($gh) {
    Write-Host "Using GitHub CLI (gh) to create release..." -ForegroundColor Green
    $bodyFile = Join-Path $env:TEMP "animerepo-release-body.md"
    $body | Set-Content -Path $bodyFile -Encoding UTF8
    gh release create $tag --title $title --notes-file $bodyFile
    Remove-Item $bodyFile -ErrorAction SilentlyContinue
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Release created: https://github.com/mTulsiram/AnimeRepo/releases/tag/$tag" -ForegroundColor Green
        exit 0
    }
    Write-Host "gh release create failed. Use manual steps below." -ForegroundColor Yellow
}

# Fallback: tag locally, then show manual steps
Write-Host "GitHub CLI (gh) not found or failed. Creating tag locally and showing manual steps." -ForegroundColor Yellow
Write-Host ""

# Tag only if not exists
$tagExists = git tag -l $tag
if (-not $tagExists) {
    git tag -a $tag -m $title
    Write-Host "Tag $tag created. Push it with: git push origin $tag" -ForegroundColor Cyan
    Write-Host ""
    $pushTag = Read-Host "Push tag to GitHub now? (y/n)"
    if ($pushTag -eq "y") {
        git push origin $tag
    }
} else {
    Write-Host "Tag $tag already exists." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Manual: Create the release on GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "1. Open: https://github.com/mTulsiram/AnimeRepo/releases/new" -ForegroundColor White
Write-Host "2. Choose tag: $tag (or create from current main)" -ForegroundColor White
Write-Host "3. Title: $title" -ForegroundColor White
Write-Host "4. Description: (paste the v4 highlights from RELEASE-v4.md or the text above)" -ForegroundColor White
Write-Host "5. Click 'Publish release'" -ForegroundColor White
Write-Host ""
