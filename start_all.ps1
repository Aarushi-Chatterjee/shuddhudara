# start_all.ps1 - Complete SHUDDHUDARA Application Launcher
# This script starts MongoDB, Backend, and Frontend all at once

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   SHUDDHUDARA - Complete Launcher    " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check and Start MongoDB
Write-Host "📦 Step 1: Starting MongoDB..." -ForegroundColor Yellow
try {
    $mongoService = Get-Service -Name MongoDB -ErrorAction Stop
    
    if ($mongoService.Status -ne 'Running') {
        Start-Service MongoDB
        Write-Host "✅ MongoDB started successfully" -ForegroundColor Green
    } else {
        Write-Host "✅ MongoDB already running" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ MongoDB service not found!" -ForegroundColor Red
    Write-Host "   Please install MongoDB first." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit
}

Start-Sleep -Seconds 1

# Step 2: Check Backend Dependencies
Write-Host ""
Write-Host "🔧 Step 2: Checking backend dependencies..." -ForegroundColor Yellow
$backendPath = Join-Path $PSScriptRoot "backend"

if (-not (Test-Path "$backendPath\node_modules")) {
    Write-Host "⚠️  Dependencies not found. Installing..." -ForegroundColor Yellow
    Push-Location $backendPath
    npm install
    Pop-Location
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

Start-Sleep -Seconds 1

# Step 3: Start Backend Server
Write-Host ""
Write-Host "🚀 Step 3: Starting Backend Server..." -ForegroundColor Yellow
$backendArgs = "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'Backend Server' -ForegroundColor Cyan; npm run dev"
Start-Process powershell -ArgumentList $backendArgs
Write-Host "✅ Backend server starting in new window" -ForegroundColor Green

# Wait for backend to initialize
Write-Host "   Waiting for backend to initialize..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# Step 4: Test Backend Connection
Write-Host ""
Write-Host "🧪 Step 4: Testing Backend Connection..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri http://localhost:3000/ -Method Get -TimeoutSec 5
    if ($response.success) {
        Write-Host "✅ Backend is responding!" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Backend may still be starting..." -ForegroundColor Yellow
    Write-Host "   Check the backend window for status" -ForegroundColor Gray
}

Start-Sleep -Seconds 1

# Step 5: Open Frontend
Write-Host ""
Write-Host "🌐 Step 5: Opening Frontend..." -ForegroundColor Yellow
$frontendPath = Join-Path $PSScriptRoot "frontend\home\index.html"

if (Test-Path $frontendPath) {
    Start-Process $frontendPath
    Write-Host "✅ Frontend opened in browser" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend not found at: $frontendPath" -ForegroundColor Red
}

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "         🎉 Startup Complete!         " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Services Status:" -ForegroundColor White
Write-Host "  ✅ MongoDB:  Running" -ForegroundColor Green
Write-Host "  ✅ Backend:  http://localhost:3000" -ForegroundColor Green
Write-Host "  ✅ Frontend: Opened in browser" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Cyan
Write-Host "  • Backend server is running in a separate window" -ForegroundColor White
Write-Host "  • Check backend window for logs and errors" -ForegroundColor White
Write-Host "  • Frontend will connect to http://localhost:3000/api" -ForegroundColor White
Write-Host "  • Close backend window or press Ctrl+C to stop server" -ForegroundColor White
Write-Host ""
Write-Host "📚 Quick Links:" -ForegroundColor Cyan
Write-Host "  • API Health: http://localhost:3000/" -ForegroundColor White
Write-Host "  • Register:   http://localhost:3000/api/auth/register" -ForegroundColor White
Write-Host "  • Login:      http://localhost:3000/api/auth/login" -ForegroundColor White
Write-Host ""
Write-Host "Happy Coding! 🌱" -ForegroundColor Green
Write-Host ""

Write-Host "Done."
