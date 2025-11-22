# ⚡ Quick Production Setup - 100% Working System

## 🎯 One-Command Installation (If Rust is Installed)

If Rust is already installed:

```powershell
cd contracts
.\setup-circom.ps1
```

This script automatically does everything (15-20 minutes).

## 📋 Step by Step (If Rust is Not Installed)

### 1. Install Rust (5 minutes)

1. Go to https://rustup.rs/
2. Download and run `rustup-init.exe`
3. Select "1) Proceed with installation (default)"
4. Close and restart terminal
5. Verify: `rustc --version`

### 2. Automatic Setup (15-20 minutes)

```powershell
cd contracts
.\setup-circom.ps1
```

### 3. Test

```powershell
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend  
cd frontend
npm run dev
```

You should see this in backend logs:
```
✅ Real ZK proof generator loaded
```

## ✅ Success Check

If setup is successful:

```
contracts/build/
├── TicketOwnership.r1cs
├── TicketOwnership_js/
│   ├── TicketOwnership.wasm
│   └── generate_witness.js
├── TicketOwnership_0001.zkey
└── verification_key.json
```

## 🚀 Get Started Now

1. **Install Rust:** https://rustup.rs/
2. **Run setup:** `cd contracts && .\setup-circom.ps1`
3. **Start backend:** `cd backend && npm run dev`
4. **Start frontend:** `cd frontend && npm run dev`
5. **Test:** http://localhost:3000

## 📝 Detailed Guide

For full details: [PRODUCTION_SETUP.md](PRODUCTION_SETUP.md)
