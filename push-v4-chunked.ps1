# ============================================
# AnimeRepo v4 - Push to GitHub in Chunks
# Run from repo root. Uses commits to avoid one huge push.
# ============================================

$ErrorActionPreference = "Stop"
$repoRoot = "c:\Users\tulsiram_methre\OneDrive - S&P Global\Documents\Projects\AnimeRepo"
Set-Location -LiteralPath $repoRoot

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AnimeRepo v4 - Chunked Push to GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# --- Chunk 1: Frontend source + config ---
Write-Host "Chunk 1: Staging frontend source, .gitignore, generator..." -ForegroundColor Green
git add frontend/
git add .gitignore
git add generate_anime_pages.py
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
    git commit -m "v4: Add Vite frontend (Bun/npm), separate CSS/JS, modal + compressed export"
    Write-Host "  Commit 1 done." -ForegroundColor Green
} else {
    Write-Host "  Nothing to commit in chunk 1 (already committed)." -ForegroundColor Yellow
}

# --- Chunk 2: Built index + assets (no anime/) ---
Write-Host ""
Write-Host "Chunk 2: Staging index.html and assets/ (built files)..." -ForegroundColor Green
git add index.html
git add assets/
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
    git commit -m "v4: Deploy built index and assets (Vite build output)"
    Write-Host "  Commit 2 done." -ForegroundColor Green
} else {
    Write-Host "  Nothing to commit in chunk 2." -ForegroundColor Yellow
}

# --- Chunk 3: Any other changed files (docs, etc.) ---
Write-Host ""
Write-Host "Chunk 3: Staging any remaining changes..." -ForegroundColor Green
git add -A
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
    git commit -m "v4: Docs and remaining updates"
    Write-Host "  Commit 3 done." -ForegroundColor Green
} else {
    Write-Host "  Nothing to commit in chunk 3." -ForegroundColor Yellow
}

# --- Push once (all commits) ---
Write-Host ""
Write-Host "Pushing to origin main (this may take a few minutes)..." -ForegroundColor Cyan
git push origin main --progress
if ($LASTEXITCODE -ne 0) {
    Write-Host "Push failed. Try: git push origin main --verbose" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Push complete. Next: create release (run release-v4.ps1 or use GitHub UI)" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Releases: https://github.com/mTulsiram/AnimeRepo/releases" -ForegroundColor Cyan
Write-Host ""
