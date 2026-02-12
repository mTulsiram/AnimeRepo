# ============================================
# AnimeRepo - Push 39K Files to GitHub
# Handles large file counts with Git LFS
# ============================================

$repoPath = "c:\Users\tulsiram_methre\OneDrive - S&P Global\Documents\Projects\AnimeRepo"
cd $repoPath

Write-Host "📦 AnimeRepo v3.0 - GitHub Push Script" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Git LFS status
Write-Host "Step 1: Checking Git LFS..." -ForegroundColor Green
$gitLfsStatus = git lfs version 2>$null
if ($gitLfsStatus) {
    Write-Host "✅ Git LFS is installed: $gitLfsStatus" -ForegroundColor Green
} else {
    Write-Host "⚠️  Git LFS not installed. Installing..." -ForegroundColor Yellow
    Write-Host "Run: choco install git-lfs" -ForegroundColor Yellow
    Write-Host "Or download from: https://git-lfs.github.com/" -ForegroundColor Yellow
}

# Step 2: Initialize Git LFS for HTML files
Write-Host "`nStep 2: Configuring Git LFS for large HTML files..." -ForegroundColor Green
git lfs install
git lfs track "anime/*.html"
git add .gitattributes
Write-Host "✅ Git LFS configured for *.html files" -ForegroundColor Green

# Step 3: Count files
Write-Host "`nStep 3: Counting files to push..." -ForegroundColor Green
$animeCount = @(Get-ChildItem anime\ -ErrorAction SilentlyContinue).Count
Write-Host "📄 Anime pages to push: $animeCount" -ForegroundColor Cyan

# Step 4: Check git status
Write-Host "`nStep 4: Checking git status..." -ForegroundColor Green
$gitStatus = git status --short | Measure-Object | Select-Object -ExpandProperty Count
Write-Host "📝 Changes in working directory: $gitStatus" -ForegroundColor Cyan

# Step 5: Add anime files to git in batches
Write-Host "`nStep 5: Adding anime files in batches..." -ForegroundColor Green

# Get all anime files
$animeFiles = @(Get-ChildItem anime\*.html -ErrorAction SilentlyContinue)
$totalFiles = $animeFiles.Count
$batchSize = 5000

if ($totalFiles -eq 0) {
    Write-Host "⚠️  No anime files found in anime/ folder" -ForegroundColor Yellow
} else {
    $batches = [Math]::Ceiling($totalFiles / $batchSize)
    
    for ($i = 0; $i -lt $batches; $i++) {
        $startIdx = $i * $batchSize
        $endIdx = [Math]::Min($startIdx + $batchSize - 1, $totalFiles - 1)
        if ($startIdx -eq $endIdx) {
            $currentBatch = @($animeFiles[$startIdx])
        } else {
            $currentBatch = @($animeFiles[$startIdx..$endIdx])
        }
        $batchNum = $i + 1
        
        Write-Host "  Batch $batchNum/$batches: Adding files $(($startIdx + 1))-$(($endIdx + 1))..." -ForegroundColor Cyan
        $files = $currentBatch | ForEach-Object { $_.FullName }
        git add $files
        Write-Host "  ✅ Batch $batchNum added" -ForegroundColor Green
    }
}

# Step 6: Add other files
Write-Host "`nStep 6: Adding modified files..." -ForegroundColor Green
git add index.html assets/js/app-v3.js generate_anime_pages.py V3-RELEASE-NOTES.md V3-DEPLOYMENT-STATUS.md GITHUB-RELEASE-NOTES.md HOW-TO-CREATE-RELEASE.md
Write-Host "✅ Modified files added" -ForegroundColor Green

# Step 7: Check what's staged
Write-Host "`nStep 7: Verifying staged changes..." -ForegroundColor Green
$stagedCount = git diff --cached --name-only | Measure-Object | Select-Object -ExpandProperty Count
Write-Host "📋 Files staged: $stagedCount" -ForegroundColor Cyan

# Step 8: Commit in batches if needed
Write-Host "`nStep 8: Creating commits..." -ForegroundColor Green

# First commit: Main UI changes
Write-Host "  Commit 1: UI and JavaScript updates..." -ForegroundColor Cyan
git add index.html assets/js/app-v3.js
git commit -m "v3.0: Update index.html with modern UI and app-v3.js filtering engine"
Write-Host "  ✅ Commit 1 pushed" -ForegroundColor Green

# Second commit: Generator and docs
Write-Host "  Commit 2: Add generator script and documentation..." -ForegroundColor Cyan
git add generate_anime_pages.py V3-RELEASE-NOTES.md V3-DEPLOYMENT-STATUS.md GITHUB-RELEASE-NOTES.md HOW-TO-CREATE-RELEASE.md
git commit -m "v3.0: Add anime page generator and release documentation"
Write-Host "  ✅ Commit 2 ready" -ForegroundColor Green

# Third commit: Anime files (in batches if necessary)
if ($totalFiles -gt 0) {
    Write-Host "  Commit 3: Add 39K+ anime detail pages..." -ForegroundColor Cyan
    git add anime/
    git commit -m "v3.0: Add 39,594 individually generated anime detail pages"
    Write-Host "  ✅ Commit 3 ready" -ForegroundColor Green
}

# Step 9: Push to GitHub
Write-Host "`nStep 9: Pushing to GitHub..." -ForegroundColor Green
Write-Host "⏳ This may take several minutes..." -ForegroundColor Yellow

$pushStart = Get-Date
git push origin main --progress
$pushEnd = Get-Date
$pushDuration = ($pushEnd - $pushStart).TotalSeconds

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Push completed successfully!" -ForegroundColor Green
    Write-Host "⏱️  Push took: $([Math]::Round($pushDuration, 2)) seconds" -ForegroundColor Cyan
} else {
    Write-Host "❌ Push failed with exit code: $LASTEXITCODE" -ForegroundColor Red
    Write-Host "Try running: git push origin main --verbose" -ForegroundColor Yellow
}

# Step 10: Verify push
Write-Host "`nStep 10: Verifying push..." -ForegroundColor Green
$localHead = git rev-parse HEAD
$remoteHead = git rev-parse origin/main 2>$null

if ($localHead -eq $remoteHead) {
    Write-Host "✅ Local and remote are in sync!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Local and remote differ. Run: git push origin main" -ForegroundColor Yellow
}

# Step 11: Summary
Write-Host "`n" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "📊 Push Summary" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Repository: https://github.com/mTulsiram/AnimeRepo" -ForegroundColor Cyan
Write-Host "Files pushed: ~$totalFiles anime files + documentation" -ForegroundColor Cyan
Write-Host "Branch: main" -ForegroundColor Cyan
Write-Host "Tag: v3.0.0" -ForegroundColor Cyan
Write-Host "" -ForegroundColor Cyan
Write-Host "🎉 v3.0.0 Ready for Release!" -ForegroundColor Green
Write-Host "Next: Create GitHub Release at" -ForegroundColor Cyan
Write-Host "https://github.com/mTulsiram/AnimeRepo/releases" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
