# start_mongodb.ps1 - MongoDB Quick Start Helper
# Run this script to check and start MongoDB service on Windows

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "  MongoDB Service Manager - SHUDDHUDARA   " -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "⚠️  Warning: Not running as Administrator" -ForegroundColor Yellow
    Write-Host "   Some operations may require admin privileges." -ForegroundColor Yellow
    Write-Host ""
}

# Check MongoDB service
Write-Host "🔍 Checking MongoDB service status..." -ForegroundColor Yellow

try {
    $service = Get-Service -Name MongoDB -ErrorAction Stop
    
    Write-Host ""
    Write-Host "Service Name: $($service.Name)" -ForegroundColor Gray
    Write-Host "Display Name: $($service.DisplayName)" -ForegroundColor Gray
    Write-Host "Status: " -NoNewline
    
    if ($service.Status -eq 'Running') {
        Write-Host "✅ RUNNING" -ForegroundColor Green
        Write-Host ""
        Write-Host "MongoDB is already running! 🎉" -ForegroundColor Green
    } else {
        Write-Host "⏸️  STOPPED" -ForegroundColor Red
        Write-Host ""
        Write-Host "Attempting to start MongoDB service..." -ForegroundColor Yellow
        
        try {
            Start-Service MongoDB -ErrorAction Stop
            Write-Host "✅ MongoDB service started successfully!" -ForegroundColor Green
        } catch {
            Write-Host "❌ Failed to start MongoDB service." -ForegroundColor Red
            Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host ""
            Write-Host "💡 Try running this script as Administrator:" -ForegroundColor Yellow
            Write-Host "   Right-click → Run as Administrator" -ForegroundColor Yellow
        }
    }
    
} catch {
    Write-Host "❌ MongoDB service not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "MongoDB may not be installed or not configured as a service." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📖 Setup Instructions:" -ForegroundColor Cyan
    Write-Host "   1. Install MongoDB from: https://www.mongodb.com/try/download/community" -ForegroundColor White
    Write-Host "   2. During installation, select 'Install MongoDB as a Service'" -ForegroundColor White
    Write-Host "   3. Or check the MongoDB Setup Guide for detailed steps" -ForegroundColor White
}

Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan

# Test MongoDB connection
Write-Host ""
Write-Host "🔗 Testing MongoDB connection..." -ForegroundColor Yellow

try {
    $testConnection = mongosh --eval "db.runCommand({ connectionStatus: 1 })" --quiet 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ MongoDB connection successful!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Available commands:" -ForegroundColor Cyan
        Write-Host "  • Connect to MongoDB: " -NoNewline -ForegroundColor White
        Write-Host "mongosh" -ForegroundColor Yellow
        Write-Host "  • Use SHUDDHUDARA DB: " -NoNewline -ForegroundColor White
        Write-Host "mongosh --eval 'use shuddhudara'" -ForegroundColor Yellow
    } else {
        Write-Host "⚠️  MongoDB is running but connection test failed" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "⚠️  Could not test connection (mongosh may not be in PATH)" -ForegroundColor Yellow
    Write-Host "   MongoDB service is running, connection should work." -ForegroundColor Gray
}

Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Green
Write-Host "  1. Start the backend server: " -NoNewline -ForegroundColor White
Write-Host "cd backend; npm run dev" -ForegroundColor Yellow
Write-Host "  2. Open frontend in browser or Live Server" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit"
