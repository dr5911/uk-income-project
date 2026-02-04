@echo off
setlocal

echo [UK Product Finder] Setup starting...

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js not found. Install from https://nodejs.org/ and re-run this script.
  exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
  echo npm not found. Install Node.js (includes npm) and re-run this script.
  exit /b 1
)

echo Installing dependencies...
call npm install
if errorlevel 1 (
  echo npm install failed. Fix the errors above and re-run setup.
  exit /b 1
)

echo.
echo Starting dev server at http://localhost:3000
call npm run dev
