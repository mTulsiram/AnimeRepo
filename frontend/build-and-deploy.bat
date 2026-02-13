@echo off
REM Run from frontend folder in a terminal where Node/npm is installed.
cd /d "%~dp0"
echo Installing dependencies...
call npm install
if errorlevel 1 ( echo npm install failed. & exit /b 1 )
echo Building...
call npm run build
if errorlevel 1 ( echo Build failed. & exit /b 1 )
echo Deploying to repo root...
call node scripts/copy-dist.js
if errorlevel 1 ( echo Deploy copy failed. & exit /b 1 )
echo Done. index.html and assets copied to repo root.
pause
