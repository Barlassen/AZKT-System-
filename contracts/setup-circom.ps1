# AZKT Circom Full Setup Script (PowerShell)
# This script installs Circom and sets up the ZK proof system

Write-Host "🚀 Starting AZKT Full ZK Setup..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Rust
Write-Host "📦 Step 1: Checking Rust installation..." -ForegroundColor Yellow
try {
    $rustVersion = rustc --version 2>&1
    Write-Host "✅ Rust found: $rustVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Rust not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Rust first:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://rustup.rs/" -ForegroundColor Cyan
    Write-Host "2. Download and run rustup-init.exe" -ForegroundColor Cyan
    Write-Host "3. Restart this terminal" -ForegroundColor Cyan
    Write-Host "4. Run this script again" -ForegroundColor Cyan
    exit 1
}

# Step 2: Check if Circom is already installed
Write-Host ""
Write-Host "📦 Step 2: Checking Circom installation..." -ForegroundColor Yellow
try {
    $circomVersion = circom --version 2>&1
    Write-Host "✅ Circom found: $circomVersion" -ForegroundColor Green
    $circomInstalled = $true
} catch {
    Write-Host "⚠️  Circom not found, will install..." -ForegroundColor Yellow
    $circomInstalled = $false
}

# Step 3: Install Circom if needed
if (-not $circomInstalled) {
    Write-Host ""
    Write-Host "📦 Step 3: Installing Circom..." -ForegroundColor Yellow
    Write-Host "This will take 10-15 minutes..." -ForegroundColor Cyan
    
    # Check if circom directory exists
    if (Test-Path "circom") {
        Write-Host "⚠️  circom directory exists, removing..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force "circom"
    }
    
    # Clone circom
    Write-Host "Cloning circom repository..." -ForegroundColor Cyan
    git clone https://github.com/iden3/circom.git
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to clone circom repository!" -ForegroundColor Red
        exit 1
    }
    
    # Build circom
    Write-Host "Building circom (this takes 10-15 minutes)..." -ForegroundColor Cyan
    cd circom
    cargo build --release
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to build circom!" -ForegroundColor Red
        exit 1
    }
    
    # Install circom
    Write-Host "Installing circom globally..." -ForegroundColor Cyan
    cargo install --path circom
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install circom!" -ForegroundColor Red
        exit 1
    }
    
    cd ..
    Write-Host "✅ Circom installed successfully!" -ForegroundColor Green
} else {
    Write-Host "✅ Circom already installed, skipping..." -ForegroundColor Green
}

# Step 4: Install npm dependencies
Write-Host ""
Write-Host "📦 Step 4: Installing npm dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install npm dependencies!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependencies installed!" -ForegroundColor Green

# Step 5: Create build directory
Write-Host ""
Write-Host "📁 Step 5: Creating build directory..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "build" | Out-Null

# Step 6: Compile circuit
Write-Host ""
Write-Host "🔨 Step 6: Compiling circuit (TREE_DEPTH = 4)..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Cyan

circom circuits/TicketOwnership.circom --r1cs --wasm --sym -o build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Circuit compilation failed!" -ForegroundColor Red
    Write-Host "Check the errors above." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Circuit compiled successfully!" -ForegroundColor Green
Write-Host "📊 Generated files:" -ForegroundColor Cyan
Get-ChildItem build/ -Recurse | Select-Object Name, Length | Format-Table

# Step 7: Trusted setup
Write-Host ""
Write-Host "🔐 Step 7: Running trusted setup (Powers of Tau)..." -ForegroundColor Yellow
Write-Host "This will take 2-5 minutes..." -ForegroundColor Cyan

# Check if setup already done
if (Test-Path "build/TicketOwnership_0001.zkey") {
    Write-Host "⚠️  zkey file already exists, skipping trusted setup..." -ForegroundColor Yellow
    Write-Host "   (Delete build/ folder to regenerate)" -ForegroundColor Cyan
} else {
    Write-Host "Generating Powers of Tau..." -ForegroundColor Cyan
    snarkjs powersoftau new bn128 14 pot14_0000.ptau -v
    
    Write-Host "Contributing to Powers of Tau..." -ForegroundColor Cyan
    snarkjs powersoftau contribute pot14_0000.ptau pot14_0001.ptau --name="First contribution" -v -e="random text"
    
    Write-Host "Preparing phase 2..." -ForegroundColor Cyan
    snarkjs powersoftau prepare phase2 pot14_0001.ptau pot14_final.ptau -v
    
    Write-Host "Setting up Groth16..." -ForegroundColor Cyan
    snarkjs groth16 setup build/TicketOwnership.r1cs pot14_final.ptau build/TicketOwnership_0000.zkey
    
    Write-Host "Contributing to zkey..." -ForegroundColor Cyan
    snarkjs zkey contribute build/TicketOwnership_0000.zkey build/TicketOwnership_0001.zkey --name="1st Contributor Name" -v -e="another random text"
    
    Write-Host "Exporting verification key..." -ForegroundColor Cyan
    snarkjs zkey export verificationkey build/TicketOwnership_0001.zkey build/verification_key.json
    
    # Clean up intermediate files
    Remove-Item pot14_*.ptau -ErrorAction SilentlyContinue
    Remove-Item build/TicketOwnership_0000.zkey -ErrorAction SilentlyContinue
    
    Write-Host "✅ Trusted setup completed!" -ForegroundColor Green
}

# Final verification
Write-Host ""
Write-Host "🔍 Step 8: Verifying setup..." -ForegroundColor Yellow

$requiredFiles = @(
    "build/TicketOwnership.r1cs",
    "build/TicketOwnership_js/TicketOwnership.wasm",
    "build/TicketOwnership_0001.zkey",
    "build/verification_key.json"
)

$allFilesExist = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file (missing!)" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if ($allFilesExist) {
    Write-Host ""
    Write-Host "🎉 Setup completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Start backend: cd ..\backend; npm run dev" -ForegroundColor White
    Write-Host "2. Look for: 'Real ZK proof generator loaded'" -ForegroundColor White
    Write-Host "3. Generate a ticket - real ZK proofs will be used!" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "WARNING: Some files are missing. Please check the errors above." -ForegroundColor Yellow
    exit 1
}

