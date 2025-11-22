# 🚀 Getting ZK Proofs Working - Step by Step

This guide will help you get real Zero-Knowledge proofs working in AZKT.

## Prerequisites

### 1. Install Rust

**Windows:**
1. Download from https://rustup.rs/
2. Run the installer
3. Restart terminal

**Verify:**
```bash
rustc --version
```

### 2. Install Circom

```bash
# Clone circom repository
git clone https://github.com/iden3/circom.git
cd circom
cargo build --release
cargo install --path circom

# Verify installation
circom --version
```

**Note:** This may take 10-15 minutes to compile.

### 3. Install Node.js Dependencies

```bash
cd contracts
npm install
```

This installs:
- `circomlib` - Circom standard library
- `snarkjs` - ZK proof generation/verification

## Step-by-Step Setup

### Step 1: Compile Circuit

```bash
cd contracts
npm run compile
```

**Expected output:**
```
template instances: 1
non-linear constraints: XXX
```

**If successful:** You'll see `build/TicketOwnership_js/` folder created.

### Step 2: Trusted Setup (Powers of Tau)

This generates the cryptographic parameters needed for proofs.

```bash
cd contracts
npm run setup
```

**This will:**
1. Generate powers of tau (takes ~2-5 minutes)
2. Create zkey file for proof generation
3. Export verification key

**Expected files:**
- `build/TicketOwnership.r1cs` - Circuit constraints
- `build/TicketOwnership_0001.zkey` - Proving key
- `build/verification_key.json` - Verification key

### Step 3: Enable Real ZK Proofs in Backend

The backend will automatically detect compiled circuit files and use real ZK proofs.

**Check if it's working:**
1. Start backend: `cd backend && npm run dev`
2. Look for: `✅ Real ZK proof generator loaded`
3. Generate a ticket - should see: `Generating real ZK proof...`

## Troubleshooting

### Error: "Circuit files not found"

**Solution:** Make sure you've completed Step 1 and Step 2.

### Error: "circom: command not found"

**Solution:** 
1. Make sure Rust is installed
2. Install Circom (see Prerequisites)
3. Add Circom to PATH if needed

### Error: "Cannot find module 'circomlib'"

**Solution:**
```bash
cd contracts
npm install
```

### Error: "Poseidon component not found"

**Solution:** Make sure `circomlib` is in `node_modules`:
```bash
cd contracts
npm install circomlib
```

### Proof Generation Takes Too Long

**For testing:** Use `TREE_DEPTH = 4` in `TicketOwnership.circom`
**For production:** Use `TREE_DEPTH = 20`

## Quick Test

After setup, test the proof generation:

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Generate a ticket via frontend
cd frontend
npm run dev
```

Open http://localhost:3000 and generate a ticket. Check backend logs for:
- `✅ Real ZK proof generator loaded`
- `Generating real ZK proof...`
- `✅ Real ZK proof generated`

## Current Status

- ✅ Circuit code ready (`TicketOwnership.circom`)
- ✅ Backend integration ready (`snarkjsProof.js`)
- ⏳ **Next:** Install Circom and compile circuit
- ⏳ **Then:** Run trusted setup
- ⏳ **Finally:** Test end-to-end

## Alternative: Simplified Proofs (For Demo)

If you can't install Circom right now, the system will automatically fall back to simplified proofs. They work for demo purposes but are not real ZK proofs.

To check current mode:
- Backend logs will show: `⚠️ Real ZK proof generator not available, using simplified version`

