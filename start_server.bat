@echo off
echo ==========================================
echo SHUDDHUDARA Backend Server Launcher
echo ==========================================

echo Checking for Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in your PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b
)

echo Node.js found.

cd backend

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo Error installing dependencies.
        pause
        exit /b
    )
)

echo Starting server...
echo.
echo Once the server is running, open the website in your browser.
echo.
call npm start

pause
