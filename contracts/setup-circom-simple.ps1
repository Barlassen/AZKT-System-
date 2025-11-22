# AZKT Circom Setup Script (Simplified)
Write-Host "Starting AZKT ZK Setup..." -ForegroundColor Cyan

# Step 1: Check Rust
Write-Host "Step 1: Checking Rust..." -ForegroundColor Yellow
try {
    $rustVersion = rustc --version 2>&1
    Write-Host "Rust found: $rustVersion" -ForegroundColor Green
} catch {
    Write-Host "Rust not found! Please install from https://rustup.rs/" -ForegroundColor Red
    exit 1
}

# Step 2: Check Circom
Write-Host "Step 2: Checking Circom..." -ForegroundColor Yellow
$circomInstalled = $false
try {
    $circomVersion = circom --version 2>&1
    Write-Host "Circom found: $circomVersion" -ForegroundColor Green
    $circomInstalled = $true
} catch {
    Write-Host "Circom not found, will install..." -ForegroundColor Yellow
}

# Step 3: Install Circom if needed
if (-not $circomInstalled) {
    Write-Host "Step 3: Installing Circom (10-15 minutes)..." -ForegroundColor Yellow
    
    if (Test-Path "circom") {
        Remove-Item -Recurse -Force "circom"
    }
    
    git clone https://github.com/iden3/circom.git
    if ($LASTEXITCODE -ne 0) { exit 1 }
    
    cd circom
    cargo build --release
    if ($LASTEXITCODE -ne 0) { exit 1 }
    
    cargo install --path circom
    if ($LASTEXITCODE -ne 0) { exit 1 }
    
    cd ..
    Write-Host "Circom installed!" -ForegroundColor Green
}

# Step 4: Install dependencies
Write-Host "Step 4: Installing npm dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) { exit 1 }

# Step 5: Create build directory
New-Item -ItemType Directory -Force -Path "build" | Out-Null

# Step 6: Compile circuit
Write-Host "Step 6: Compiling circuit..." -ForegroundColor Yellow
circom circuits/TicketOwnership.circom --r1cs --wasm --sym -o build
if ($LASTEXITCODE -ne 0) { exit 1 }
Write-Host "Circuit compiled!" -ForegroundColor Green

# Step 7: Trusted setup
Write-Host "Step 7: Running trusted setup (2-5 minutes)..." -ForegroundColor Yellow
if (Test-Path "build/TicketOwnership_0001.zkey") {
    Write-Host "zkey exists, skipping setup..." -ForegroundColor Yellow
} else {
    snarkjs powersoftau new bn128 14 pot14_0000.ptau -v
    snarkjs powersoftau contribute pot14_0000.ptau pot14_0001.ptau --name="First" -v -e="random"
    snarkjs powersoftau prepare phase2 pot14_0001.ptau pot14_final.ptau -v
    snarkjs groth16 setup build/TicketOwnership.r1cs pot14_final.ptau build/TicketOwnership_0000.zkey
    snarkjs zkey contribute build/TicketOwnership_0000.zkey build/TicketOwnership_0001.zkey --name="Contributor" -v -e="random2"
    snarkjs zkey export verificationkey build/TicketOwnership_0001.zkey build/verification_key.json
    Remove-Item pot14_*.ptau -ErrorAction SilentlyContinue
    Remove-Item build/TicketOwnership_0000.zkey -ErrorAction SilentlyContinue
    Write-Host "Trusted setup completed!" -ForegroundColor Green
}

# Step 8: Verify
Write-Host "Step 8: Verifying..." -ForegroundColor Yellow
$files = @("build/TicketOwnership.r1cs", "build/TicketOwnership_js/TicketOwnership.wasm", "build/TicketOwnership_0001.zkey", "build/verification_key.json")
$allOk = $true
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "OK: $file" -ForegroundColor Green
    } else {
        Write-Host "MISSING: $file" -ForegroundColor Red
        $allOk = $false
    }
}

if ($allOk) {
    Write-Host "Setup completed successfully!" -ForegroundColor Green
    Write-Host "Next: cd ..\backend; npm run dev" -ForegroundColor Cyan
} else {
    Write-Host "Some files are missing!" -ForegroundColor Red
    exit 1
}

