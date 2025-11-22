# Circom & snarkjs Setup Guide

## Prerequisites

- Node.js 18+
- Rust (for circom compiler)
- Git

## Installation Steps

### 1. Install Rust

```bash
# On macOS/Linux
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# On Windows
# Download and run: https://rustup.rs/
```

### 2. Install circom

```bash
# Clone circom repository
git clone https://github.com/iden3/circom.git
cd circom
cargo build --release
cargo install --path circom

# Verify installation
circom --version
```

### 3. Install circomlib

```bash
# Navigate to contracts directory
cd contracts

# Install circomlib
npm install circomlib

# Or clone directly
git clone https://github.com/iden3/circomlib.git
```

### 4. Install snarkjs

```bash
# In contracts directory
npm install snarkjs
```

### 5. Verify Installation

```bash
circom --version
snarkjs --version
```

## Circuit Compilation

### Step 1: Compile Circuit

```bash
cd contracts
circom circuits/TicketOwnership.circom --r1cs --wasm --sym -o build
```

This generates:
- `build/TicketOwnership.r1cs` - R1CS constraint file
- `build/TicketOwnership.wasm` - WASM file for witness generation
- `build/TicketOwnership.sym` - Symbol file

### Step 2: Trusted Setup (Powers of Tau)

```bash
# Generate initial powers of tau
snarkjs powersoftau new bn128 14 pot14_0000.ptau -v

# Contribute to ceremony
snarkjs powersoftau contribute pot14_0000.ptau pot14_0001.ptau \
  --name="First contribution" -v -e="random text"

# Prepare phase 2
snarkjs powersoftau prepare phase2 pot14_0001.ptau pot14_final.ptau -v
```

### Step 3: Generate ZKey

```bash
# Setup Groth16
snarkjs groth16 setup build/TicketOwnership.r1cs pot14_final.ptau \
  build/TicketOwnership_0000.zkey

# Contribute to zkey
snarkjs zkey contribute build/TicketOwnership_0000.zkey \
  build/TicketOwnership_0001.zkey --name="1st Contributor" -v -e="another random text"

# Export verification key
snarkjs zkey export verificationkey build/TicketOwnership_0001.zkey \
  build/verification_key.json
```

## Generating Proofs

### Using Node.js Script

Create `contracts/scripts/generateProof.js`:

```javascript
import { readFileSync } from 'fs';
import { execSync } from 'child_process';

// Load inputs
const inputs = {
  privateKey: "123456789",
  ticketID: "ticket-123",
  merkleRoot: "0x...",
  ticketCommitmentPath: [...]
};

// Generate witness
execSync(`node build/TicketOwnership_js/generate_witness.js \
  build/TicketOwnership_js/TicketOwnership.wasm \
  input.json witness.wtns`);

// Generate proof
execSync(`snarkjs groth16 prove build/TicketOwnership_0001.zkey \
  witness.wtns proof.json public.json`);

// Verify proof
execSync(`snarkjs groth16 verify build/verification_key.json \
  public.json proof.json`);
```

## Integration with Backend

### Backend (SBB Server)

1. Generate Merkle tree with ticket commitments
2. Return `merkleRoot` and `merkleProof` to client
3. Store Merkle tree state

### Frontend (User App)

1. Receive `merkleRoot` and `merkleProof` from backend
2. Compile circuit (or use pre-compiled)
3. Generate witness with:
   - `privateKey` (secret)
   - `ticketCommitmentPath` (from merkleProof)
   - `merkleRoot` (public)
   - `ticketID` (public)
4. Generate ZK proof using snarkjs
5. Include proof in ticket QR code

## Troubleshooting

### Common Issues

1. **Circom not found**: Add to PATH or use full path
2. **Circomlib not found**: Install in contracts directory
3. **R1CS generation fails**: Check circuit syntax
4. **Witness generation fails**: Verify input format
5. **Proof generation fails**: Check zkey file

### Performance Notes

- Circuit compilation: ~30 seconds
- Witness generation: < 1 second
- Proof generation: 1-5 seconds
- Proof verification: < 1 second

## Next Steps

1. Set up automated build pipeline
2. Pre-compile circuits for production
3. Optimize circuit for smaller proofs
4. Implement proof caching
5. Add proof verification in verification agent

