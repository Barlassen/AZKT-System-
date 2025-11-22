# ⚡ Quick Setup for ZK Proofs

## Windows PowerShell - One Command Setup

Run this in PowerShell (as Administrator if needed):

```powershell
# 1. Check if Rust is installed
rustc --version

# If not installed, download from https://rustup.rs/

# 2. Install Circom (if not installed)
# Clone and build (takes 10-15 minutes)
git clone https://github.com/iden3/circom.git
cd circom
cargo build --release
cargo install --path circom

# 3. Install dependencies
cd ..\contracts
npm install

# 4. Compile circuit
npm run compile

# 5. Run trusted setup
npm run setup
```

## What Each Step Does

### `npm run compile`
- Compiles `TicketOwnership.circom` to WebAssembly
- Creates `build/TicketOwnership_js/` folder
- Generates `.r1cs` file (circuit constraints)

### `npm run setup`
- Generates Powers of Tau (cryptographic parameters)
- Creates `.zkey` file (proving key)
- Exports verification key

## After Setup

Once setup is complete:
1. Backend will automatically detect compiled files
2. Real ZK proofs will be generated
3. No code changes needed!

## Verify It's Working

```bash
# Start backend
cd backend
npm run dev

# Look for this in logs:
# ✅ Real ZK proof generator loaded
```

## Files Created

After successful setup, you should have:

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

