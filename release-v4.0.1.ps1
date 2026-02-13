# ============================================
# AnimeRepo v4.0.1 - Create GitHub Release
# Run after pushing. Uses gh CLI if installed.
# ============================================

$ErrorActionPreference = "Stop"
$repoRoot = "c:\Users\tulsiram_methre\OneDrive - S&P Global\Documents\Projects\AnimeRepo"
Set-Location -LiteralPath $repoRoot

$tag = "v4.0.1"
$title = "v4.0.1 - UI polish, README, Where to watch, footer"

$body = @"
## AnimeRepo v4.0.1

### Highlights
- **UI polish** – DM Sans font, updated indigo/violet palette, improved hero and footer.
- **Cards** – 12px radius, hover shadow, clearer messaging.
- **README** – Full rewrite: features, data sources, where to watch (legal only), tech stack.
- **Modal** – "Where to watch & details" with MAL/AniList/AniDB/Kitsu + Search Crunchyroll / Find on JustWatch.
- **Footer** – Data & watch links; "Metadata only; watch via linked legal services."

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
