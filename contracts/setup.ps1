# AZKT Circom Setup Script (PowerShell)
# This script installs circomlib and performs the first compilation

Write-Host "🚀 Starting AZKT Circom Setup..." -ForegroundColor Cyan

# 1. Install circomlib
Write-Host "📦 Installing circomlib..." -ForegroundColor Yellow
npm install circomlib

# 2. Verify circomlib is in the correct location
if (-not (Test-Path "node_modules/circomlib")) {
    Write-Host "❌ circomlib installation failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ circomlib installed" -ForegroundColor Green

# 3. Create build directory
Write-Host "📁 Creating build directory..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "build" | Out-Null

# 4. Try first compilation (with TREE_DEPTH = 4)
Write-Host "🔨 Compiling circuit (TREE_DEPTH = 4)..." -ForegroundColor Yellow
circom circuits/TicketOwnership.circom --r1cs --wasm --sym -o build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Compilation successful! The biggest technical obstacle of the project has been overcome!" -ForegroundColor Green
    Write-Host "📊 Generated files:" -ForegroundColor Cyan
    Get-ChildItem build/
} else {
    Write-Host "❌ Compilation failed! Please check the errors." -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Setup completed!" -ForegroundColor Green
