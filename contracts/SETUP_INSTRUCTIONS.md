# 🔧 ZK Proof Setup Instructions

## Current Status

✅ **Circuit code ready** - `TicketOwnership.circom`  
✅ **Dependencies installed** - `circomlib` and `snarkjs`  
⏳ **Need:** Circom compiler installation  
⏳ **Need:** Circuit compilation  
⏳ **Need:** Trusted setup

## Quick Setup (Windows)

### Step 1: Install Rust

1. Go to https://rustup.rs/
2. Download and run `rustup-init.exe`
3. Follow the installer (default options are fine)
4. **Restart your terminal/PowerShell**

Verify:
```powershell
rustc --version
```

### Step 2: Install Circom

Open PowerShell and run:

```powershell
# Clone circom repository
git clone https://github.com/iden3/circom.git
cd circom

# Build circom (takes 10-15 minutes)
cargo build --release

# Install circom globally
cargo install --path circom

# Verify installation
circom --version
```

**Expected output:** `circom compiler version X.X.X`

### Step 3: Compile Circuit

```powershell
cd C:\Users\bsen2\AZKT-System-\contracts
npm run compile
```

**Expected output:**
```
template instances: 1
non-linear constraints: XXX
```

**If successful:** You'll see `build/TicketOwnership_js/` folder.

### Step 4: Trusted Setup

```powershell
npm run setup
```

**This takes 2-5 minutes** and creates:
- `build/TicketOwnership_0001.zkey` - Proving key
- `build/verification_key.json` - Verification key

### Step 5: Test

```powershell
# Terminal 1: Start backend
cd ..\backend
npm run dev

# Look for: ✅ Real ZK proof generator loaded
```

## Alternative: Use Pre-compiled Files (If Available)

If someone has already compiled the circuit, you can use their files:

1. Copy `build/` folder to `contracts/build/`
2. Backend will automatically detect and use real ZK proofs

## Troubleshooting

### "circom: command not found"

**Solution:**
1. Make sure Rust is installed: `rustc --version`
2. Install Circom (Step 2 above)
3. Restart terminal after installation

### "Cannot find module 'circomlib'"

**Solution:**
```powershell
cd contracts
npm install
```

### Compilation Errors

**Check:**
1. `circomlib` is in `node_modules/`
2. Circuit file path is correct
3. All includes are correct

### Setup Takes Too Long

**For testing:** Use `TREE_DEPTH = 4` in `TicketOwnership.circom`  
**For production:** Use `TREE_DEPTH = 20`

## Current Workaround

**System works without Circom!** It uses simplified proofs for demo purposes.

To check current mode:
- Backend logs: `⚠️ Real ZK proof generator not available, using simplified version`

This is fine for hackathon demo. Real ZK proofs are optional but recommended for production.

## Next Steps After Setup

Once setup is complete:
1. ✅ Backend automatically detects compiled files
2. ✅ Real ZK proofs are generated
3. ✅ No code changes needed!

## Files You'll Have After Setup

```
contracts/build/
├── TicketOwnership.r1cs              # Circuit constraints
├── TicketOwnership_js/               # Compiled circuit
│   ├── TicketOwnership.wasm
│   └── generate_witness.js
├── TicketOwnership_0001.zkey         # Proving key
└── verification_key.json             # Verification key
```

## Need Help?

See [GETTING_ZK_WORKING.md](../docs/GETTING_ZK_WORKING.md) for detailed troubleshooting.

