# Quick ZK Proof Setup Guide

## 🎯 Goal
Get real ZK proofs working (not placeholders) in 30 minutes

## ⚡ Quick Start (Server-Side Proofs)

### Step 1: Install Dependencies

```bash
# Install circomlibjs for Poseidon hash
cd backend
npm install circomlibjs

# Install snarkjs globally or locally
npm install snarkjs
```

### Step 2: Compile Circuit

```bash
cd contracts
npm install circomlib

# Compile circuit (start with TREE_DEPTH=4 for speed)
circom circuits/TicketOwnership.circom --r1cs --wasm --sym -o build
```

### Step 3: Generate Trusted Setup (Quick Version)

```bash
cd contracts

# Generate small powers of tau (for testing)
snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="Test" -v -e="test"
snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v

# Generate zkey
snarkjs groth16 setup build/TicketOwnership.r1cs pot12_final.ptau build/TicketOwnership_0000.zkey
snarkjs zkey contribute build/TicketOwnership_0000.zkey build/TicketOwnership_0001.zkey --name="Test" -v

# Export verification key
snarkjs zkey export verificationkey build/TicketOwnership_0001.zkey build/verification_key.json
```

### Step 4: Update Backend to Use Real Proofs

Backend will automatically detect compiled circuit and use real ZK proofs.

### Step 5: Test

```bash
# Start backend
cd backend
npm run dev

# Generate a ticket - should see "✅ Real ZK proof generated"
```

## 🔍 Verification

### Check if Real Proofs are Working

1. Generate a ticket via API
2. Check ticket response - should have `zkProof.type: 'real_zk_proof'`
3. Verify ticket - should see ZK proof verification

### Debug

If you see "⚠️ Real ZK proof generator not available":
- Check if circuit is compiled: `ls contracts/build/TicketOwnership.wasm`
- Check if zkey exists: `ls contracts/build/TicketOwnership_0001.zkey`
- Check paths in `backend/src/zk/snarkjsProof.js`

## 📝 Notes

- **TREE_DEPTH=4**: Fast for testing, use 20 for production
- **Small powers of tau**: Faster setup, less secure (OK for hackathon)
- **Server-side proofs**: Simpler than browser integration
- **Automatic fallback**: If real proofs fail, uses simplified version

## 🚀 Production Setup

For production:
1. Use TREE_DEPTH=20
2. Use larger powers of tau (14+)
3. Secure trusted setup ceremony
4. Consider client-side proofs for true zero-knowledge

