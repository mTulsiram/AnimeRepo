# ============================================
# AnimeRepo v4 - Full automation (build -> push -> release)
# Run from repo root. Requires: Bun (or npm), Git, optionally GitHub CLI (gh).
# ============================================

$ErrorActionPreference = "Stop"
$repoRoot = "c:\Users\tulsiram_methre\OneDrive - S&P Global\Documents\Projects\AnimeRepo"
Set-Location -LiteralPath $repoRoot

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AnimeRepo v4 - Build, Push, Release" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# --- Step 1: Build (Bun) ---
Write-Host "Step 1: Building frontend (Bun)..." -ForegroundColor Green
Set-Location -LiteralPath (Join-Path $repoRoot "frontend")
$bun = Get-Command bun -ErrorAction SilentlyContinue
if (-not $bun) {
    Write-Host "Bun not found. Try: npm run build && node scripts/copy-dist.js" -ForegroundColor Yellow
    Set-Location -LiteralPath $repoRoot
    exit 1
}
bun run deploy:bun
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed." -ForegroundColor Red
    Set-Location -LiteralPath $repoRoot
    exit 1
}
Set-Location -LiteralPath $repoRoot
Write-Host "  Build done." -ForegroundColor Green
Write-Host ""

# --- Step 2: Chunked push ---
Write-Host "Step 2: Pushing to GitHub (chunked commits)..." -ForegroundColor Green
& (Join-Path $repoRoot "push-v4-chunked.ps1")
if ($LASTEXITCODE -ne 0) {
    Write-Host "Push failed." -ForegroundColor Red
    exit 1
}
Write-Host ""

# --- Step 3: Release ---
Write-Host "Step 3: Create release (tag v4.0.0)..." -ForegroundColor Green
$doRelease = Read-Host "Create GitHub release now? (y/n)"
if ($doRelease -eq "y") {
    & (Join-Path $repoRoot "release-v4.ps1")
} else {
    Write-Host "Skipped. Run release-v4.ps1 later or create release at:" -ForegroundColor Yellow
    Write-Host "  https://github.com/mTulsiram/AnimeRepo/releases/new" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Automation complete." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
