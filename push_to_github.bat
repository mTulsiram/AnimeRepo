@echo off
REM ============================================
REM AnimeRepo - Push 39K Files to GitHub (Batch)
REM ============================================

cd /d "c:\Users\tulsiram_methre\OneDrive - S&P Global\Documents\Projects\AnimeRepo"

echo.
echo ========================================
echo 📦 AnimeRepo v3.0 - Push to GitHub
echo ========================================
echo.

REM Step 1: Initialize Git LFS
echo Step 1: Setting up Git LFS...
git lfs install
if %ERRORLEVEL% EQU 0 (
    echo ✅ Git LFS initialized
) else (
    echo ⚠️  Git LFS setup skipped
)

REM Step 2: Configure LFS for HTML files
echo.
echo Step 2: Configuring LFS for anime pages...
git lfs track "anime/*.html"
git add .gitattributes
echo ✅ LFS configured for *.html files

REM Step 3: Add documentation files
echo.
echo Step 3: Adding updated files...
git add index.html assets/js/app-v3.js generate_anime_pages.py
git add V3-*.md GITHUB-RELEASE-NOTES.md HOW-TO-CREATE-RELEASE.md
echo ✅ Documentation and main files added

REM Step 4: First commit - UI changes
echo.
echo Step 4: Committing UI changes...
git commit -m "v3.0: Modern UI redesign with app-v3.js and updated documentation"
if %ERRORLEVEL% EQU 0 (
    echo ✅ Commit 1 successful
) else (
    echo ⚠️  Nothing new to commit
)

REM Step 5: Add anime files
echo.
echo Step 5: Adding 39K+ anime detail pages...
git add anime/
echo ✅ Anime pages added to staging

REM Step 6: Commit anime files
echo.
echo Step 6: Committing anime pages...
git commit -m "v3.0: Add 39,594 individually generated anime detail pages"
if %ERRORLEVEL% EQU 0 (
    echo ✅ Commit 2 successful
) else (
    echo ⚠️  Nothing new to commit
)

REM Step 7: Push to GitHub
echo.
echo Step 7: Pushing to GitHub...
echo ⏳ This may take 5-10 minutes...
git push origin main --progress
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Push completed successfully!
) else (
    echo.
    echo ❌ Push failed!
    echo Try running: git push origin main --verbose
    exit /b 1
)

REM Step 8: Verify
echo.
echo Step 8: Verifying push...
git log --oneline -2
echo.
echo ========================================
echo 🎉 v3.0.0 Push Complete!
echo ========================================
echo.
echo Repository: https://github.com/mTulsiram/AnimeRepo
echo Create Release: https://github.com/mTulsiram/AnimeRepo/releases
echo.
pause
