# 🚂 AZKT - Anonymous Zero-Knowledge Ticket System

**A privacy-preserving ticketing system for SBB CFF FFS**

## 🎯 Core Principles

- **Anonymity**: No personal data collected
- **ZK Proof**: Prove ticket validity without revealing identity  
- **Ephemeral Wallet**: Single-use key pairs, impossible to track users
- **Copy-Safe**: Tickets cannot be copied and reused
- **Multi-Check**: Tickets can be verified multiple times
- **Easy Access**: Low entry barrier for non-technical users
- **Print@Home**: Tickets can be printed on paper
- **Secure**: Against misuse and fraud
- **Low Cost**: Due to minimal data

## 🚀 Quick Start

### Option 1: Demo Mode (Simplified Proofs)

Works immediately, no setup required:

```bash
# Install dependencies
npm install

# Start backend
cd backend && npm run dev

# Start frontend (new terminal)
cd frontend && npm run dev

# Open http://localhost:3000
```

### Option 2: Production Mode (Real ZK Proofs)

For %100 working real ZK proofs:

1. **Install Rust:** https://rustup.rs/
2. **Run setup:**
   ```powershell
   cd contracts
   .\setup-circom.ps1
   ```
3. **Start services:**
   ```bash
   cd backend && npm run dev
   cd frontend && npm run dev
   ```

See [QUICK_PRODUCTION_SETUP.md](QUICK_PRODUCTION_SETUP.md) for details.

## 📁 Project Structure

```
AZKT-System/
├── frontend/          # Next.js frontend
├── backend/           # Node.js/Express backend
├── contracts/         # Circom circuits & ZK proofs
├── verification/      # Offline verification agent
└── docs/              # Documentation
```

## 🔐 ZK Proof System

- **Circuit**: `contracts/circuits/TicketOwnership.circom`
- **Based on**: Hydra-S3 proving scheme
- **Format**: Hydra-S3 standard (pathElements + pathIndices)
- **Proof System**: Groth16 (via snarkjs)

## 📚 Documentation

- [START_HERE.md](START_HERE.md) - Quick start guide
- [PRODUCTION_SETUP.md](PRODUCTION_SETUP.md) - Full production setup
- [QUICK_PRODUCTION_SETUP.md](QUICK_PRODUCTION_SETUP.md) - Fast setup guide
- [docs/GETTING_ZK_WORKING.md](docs/GETTING_ZK_WORKING.md) - ZK proof setup
- [docs/CURRENT_STATUS.md](docs/CURRENT_STATUS.md) - Implementation status

## 🎯 Features

✅ Ephemeral wallet generation  
✅ Merkle tree integration  
✅ ZK proof generation (real or simplified)  
✅ QR code generation (Print@Home ready)  
✅ Copy protection  
✅ Nullifier system (single-use guarantee)  
✅ Offline verification  
✅ SBB ticket format compliance  

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React
- **Backend**: Node.js, Express
- **ZK Proofs**: Circom, snarkjs
- **Cryptography**: Poseidon hash, Merkle trees
- **QR Codes**: qrcode library

## 📝 License

MIT

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)
