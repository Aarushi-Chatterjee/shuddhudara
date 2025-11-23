# Simple Launcher
Write-Host "Starting Services..."

# Start MongoDB
try {
    $mongo = Get-Service -Name MongoDB -ErrorAction SilentlyContinue
    if ($mongo -and $mongo.Status -ne 'Running') {
        Start-Service MongoDB
        Write-Host "MongoDB Started."
    } else {
        Write-Host "MongoDB is running or service not found."
    }
} catch {
    Write-Host "Could not check MongoDB service."
}

# Start Backend
$backendPath = Join-Path $PSScriptRoot "backend"
if (Test-Path $backendPath) {
    Write-Host "Starting Backend..."
    $args = "-NoExit", "-Command", "cd '$backendPath'; npm run dev"
    Start-Process powershell -ArgumentList $args
} else {
    Write-Host "Backend directory not found!"
}

# Open Frontend
$frontendPath = Join-Path $PSScriptRoot "frontend\home\index.html"
if (Test-Path $frontendPath) {
    Write-Host "Opening Frontend..."
    Start-Process $frontendPath
} else {
    Write-Host "Frontend file not found!"
}

Write-Host "Done."
