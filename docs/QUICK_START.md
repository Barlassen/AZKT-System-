# AZKT Quick Start Guide

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- (Optional) Rust & circom for full ZK proofs

### Installation

```bash
# Clone repository
git clone <repo-url>
cd AZKT-System

# Install all dependencies
npm install

# Or install per workspace
cd frontend && npm install
cd ../backend && npm install
cd ../verification && npm install
cd ../contracts && npm install
```

### Running the System

#### Option 1: Run All Services

```bash
# From root directory
npm run dev
```

#### Option 2: Run Individually

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

**Terminal 3 - Verification Agent:**
```bash
cd verification
npm run dev
# Agent runs on http://localhost:3002
```

### Testing the Flow

1. **Open Browser**: Navigate to `http://localhost:3000`

2. **Generate Ticket**:
   - Select a route (e.g., Lausanne → Geneva)
   - Choose departure time
   - Click "Generate Anonymous Ticket"

3. **View Ticket**:
   - QR code will be displayed
   - Ticket includes Merkle root and proof data

4. **Verify Ticket** (using verification agent):
   ```bash
   curl -X POST http://localhost:3002/api/verify \
     -H "Content-Type: application/json" \
     -d '{"ticket": {...ticket data...}}'
   ```

## 🔧 Setting Up Full ZK Proofs

### Step 1: Install Circom

```bash
# Install Rust first
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install circom
git clone https://github.com/iden3/circom.git
cd circom
cargo build --release
cargo install --path circom
```

### Step 2: Install Dependencies

```bash
cd contracts
npm install circomlib snarkjs
```

### Step 3: Compile Circuit

```bash
cd contracts
circom circuits/TicketOwnership.circom --r1cs --wasm --sym -o build
```

### Step 4: Generate Trusted Setup

```bash
# Generate powers of tau
snarkjs powersoftau new bn128 14 pot14_0000.ptau -v

# Contribute
snarkjs powersoftau contribute pot14_0000.ptau pot14_0001.ptau \
  --name="First contribution" -v -e="random text"

# Prepare phase 2
snarkjs powersoftau prepare phase2 pot14_0001.ptau pot14_final.ptau -v

# Generate zkey
snarkjs groth16 setup build/TicketOwnership.r1cs pot14_final.ptau \
  build/TicketOwnership_0000.zkey

snarkjs zkey contribute build/TicketOwnership_0000.zkey \
  build/TicketOwnership_0001.zkey --name="1st Contributor" -v

# Export verification key
snarkjs zkey export verificationkey build/TicketOwnership_0001.zkey \
  build/verification_key.json
```

### Step 5: Test Proof Generation

```bash
# Use the script
node contracts/scripts/generateProof.js
```

## 📝 Environment Variables

### Backend (.env)

```env
PORT=3001
SBB_PRIVATE_KEY=your_sbb_private_key_base64
SBB_PUBLIC_KEY=your_sbb_public_key_base64
```

### Verification Agent (.env)

```env
PORT=3002
SBB_PUBLIC_KEY=your_sbb_public_key_base64
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

## 🐛 Troubleshooting

### Port Already in Use
Change ports in `.env` files or kill existing processes.

### Circom Not Found
Add circom to PATH or use full path.

### Merkle Tree Not Initialized
Backend will create tree on first ticket request.

### ZK Proof Generation Fails
Ensure circuit is compiled and zkey exists.

## 📚 Next Steps

- Read [CIRCOM_SETUP.md](./CIRCOM_SETUP.md) for detailed ZK setup
- Read [MERKLE_TREE.md](./MERKLE_TREE.md) for Merkle tree details
- Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system architecture
- Read [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) for current status

## 🎯 Hackathon Demo

For hackathon presentation:
1. Show Merkle tree generation
2. Show commitment creation
3. Show simplified proof structure
4. Explain full ZK proof flow
5. Demonstrate offline verification

See [DEMO_SCRIPT.md](./DEMO_SCRIPT.md) for detailed demo flow.

