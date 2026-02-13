@echo off
REM Run from frontend folder. Requires Bun: https://bun.sh
cd /d "%~dp0"
echo Installing with Bun...
call bun install
if errorlevel 1 ( echo bun install failed. & exit /b 1 )
echo Building and deploying...
call bun run deploy:bun
if errorlevel 1 ( echo deploy failed. & exit /b 1 )
echo Done. index.html and assets copied to repo root.
pause
