# AZKT Contracts - Circom Circuits

This directory contains the Zero-Knowledge Proof circuits for the AZKT system.

## 📁 File Structure

```
contracts/
├── circuits/
│   ├── TicketOwnership.circom    # Main ZK proof circuit (Hydra-S3 based)
│   └── common/
│       └── verify-merkle-path.circom  # Hydra-S3 Merkle path verifier
├── scripts/
│   └── generateProof.js          # Proof generation script
├── setup.sh                      # Linux/Mac setup script
├── setup.ps1                     # Windows PowerShell setup script
└── package.json                  # Dependencies
```

## 🚀 Quick Start

### Step 1: Prerequisites

```bash
# Install Rust (required for circom)
# macOS/Linux:
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Windows:
# Download from https://rustup.rs/
```

```bash
# Install circom
git clone https://github.com/iden3/circom.git
cd circom
cargo build --release
cargo install --path circom

# Verify installation
circom --version
```

### Step 2: Install Libraries

```bash
cd contracts
npm install
```

This command installs `circomlib` and `snarkjs`.

### Step 3: First Compilation (TREE_DEPTH = 4)

According to the action plan, start with a small depth:

```bash
# Linux/Mac:
chmod +x setup.sh
./setup.sh

# Windows:
.\setup.ps1

# Or manually:
circom circuits/TicketOwnership.circom --r1cs --wasm --sym -o build
```

**If successful:** The biggest technical obstacle of the project has been overcome! ✅

### Step 4: Transition to Production Depth

After the first compilation is successful, update to `TREE_DEPTH = 20`:

```circom
// In TicketOwnership.circom
const TREE_DEPTH = 20;  // Increase from 4 to 20
```

Then compile again:

```bash
circom circuits/TicketOwnership.circom --r1cs --wasm --sym -o build
```

## 📋 Circuit Details

### Circuit Architecture

**Main Circuit**: `TicketOwnership.circom`  
**Based on**: Hydra-S3 proving scheme (simplified for tickets)  
**Reference**: https://github.com/sismo-core/hydra-s3-zkps

### Inputs

**Private:**
- `privateKey`: Ephemeral wallet's private key
- `ticketCommitmentPathElements[TREE_DEPTH]`: Merkle path elements (Hydra-S3 format)
- `ticketCommitmentPathIndices[TREE_DEPTH]`: Merkle path indices (0=left, 1=right)

**Public:**
- `merkleRoot`: SBB's Merkle root
- `ticketID`: Ticket ID

### Outputs

- `isValid`: Returns 1 if proof is successful

### Operations

1. **Commitment Creation**: `userCommitment = Poseidon(privateKey, ticketID)` (Hydra-S3 style)
2. **Merkle Proof Verification**: Verify that `userCommitment` is in the Merkle tree using Hydra-S3 format
3. **Nullifier Creation**: `nullifier = Poseidon(privateKey, ticketID, salt)` for single-use guarantee

## 🔧 Usage

### Compilation

```bash
npm run compile
```

### Trusted Setup (Powers of Tau)

```bash
npm run setup
```

### Proof Generation

```bash
npm run generate-proof
```

## 📚 More Information

- [CIRCOM_SETUP.md](../docs/CIRCOM_SETUP.md) - Detailed setup guide
- [MERKLE_TREE.md](../docs/MERKLE_TREE.md) - Merkle tree documentation

## ⚠️ Notes

- Use `TREE_DEPTH = 4` for initial testing
- Use `TREE_DEPTH = 20` for production
- `circomlib` must be in `node_modules`
- If compilation fails, check the `circomlib` path
