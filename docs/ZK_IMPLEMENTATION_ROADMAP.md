# ZK Proof Implementation Roadmap

## 🎯 Goal
Make ZK proofs fully functional (not just placeholders)

## Current Status: ❌ Placeholder Only

**What's NOT working:**
- ❌ ZK proofs are just hash commitments (not real ZK)
- ❌ snarkjs not integrated
- ❌ Circuit not compiled
- ❌ No trusted setup
- ❌ Poseidon hash is SHA-256 (not real Poseidon)

**What IS working:**
- ✅ Merkle Tree system
- ✅ Ticket generation
- ✅ Basic verification
- ✅ Frontend/Backend structure

## 📋 Implementation Steps

### Step 1: Compile Circom Circuit ✅ (Ready)

**File:** `contracts/circuits/TicketOwnership.circom`

**Action:**
```bash
cd contracts
npm install circomlib
circom circuits/TicketOwnership.circom --r1cs --wasm --sym -o build
```

**Expected Output:**
- `build/TicketOwnership.r1cs`
- `build/TicketOwnership.wasm`
- `build/TicketOwnership.sym`

### Step 2: Generate Trusted Setup (Powers of Tau)

**Action:**
```bash
cd contracts
snarkjs powersoftau new bn128 14 pot14_0000.ptau -v
snarkjs powersoftau contribute pot14_0000.ptau pot14_0001.ptau --name="First contribution" -v -e="random text"
snarkjs powersoftau prepare phase2 pot14_0001.ptau pot14_final.ptau -v
```

**Expected Output:**
- `pot14_final.ptau`

### Step 3: Generate zkey

**Action:**
```bash
snarkjs groth16 setup build/TicketOwnership.r1cs pot14_final.ptau build/TicketOwnership_0000.zkey
snarkjs zkey contribute build/TicketOwnership_0000.zkey build/TicketOwnership_0001.zkey --name="1st Contributor" -v
snarkjs zkey export verificationkey build/TicketOwnership_0001.zkey build/verification_key.json
```

**Expected Output:**
- `build/TicketOwnership_0001.zkey`
- `build/verification_key.json`

### Step 4: Implement Real Poseidon Hash (Node.js)

**Problem:** Current implementation uses SHA-256, but circuit uses Poseidon.

**Solution:** Use `circomlib` Poseidon implementation in Node.js

**File to create:** `backend/src/crypto/poseidon.js`

### Step 5: Backend Proof Generation

**File:** `backend/src/zk/proofGenerator.js` (new)

**Action:**
- Use snarkjs to generate proofs
- Load compiled circuit (.wasm)
- Generate witness
- Create proof using .zkey

### Step 6: Frontend Proof Generation

**File:** `frontend/src/lib/zkProof.js` (update)

**Action:**
- Load snarkjs in browser
- Generate witness from inputs
- Create proof using .zkey
- Include proof in ticket

### Step 7: Verification Agent Proof Verification

**File:** `verification/src/zk/verifier.js` (update)

**Action:**
- Load verification key
- Use snarkjs to verify proofs
- Return verification result

## 🔧 Technical Challenges

### Challenge 1: Browser snarkjs Integration
- snarkjs is Node.js library
- Need to bundle for browser or use WebAssembly version
- **Solution:** Use `snarkjs` via CDN or bundle with webpack

### Challenge 2: Poseidon Hash in Node.js
- Circuit uses Poseidon, backend uses SHA-256
- Must match exactly
- **Solution:** Use `circomlib` Poseidon implementation

### Challenge 3: Large Files (zkey, wasm)
- zkey files can be large (MBs)
- Need efficient loading
- **Solution:** Lazy load, CDN, or pre-load

### Challenge 4: Proof Generation Time
- ZK proof generation can take 1-5 seconds
- User experience impact
- **Solution:** Show loading state, optimize circuit

## 📦 Required Packages

### Backend
```json
{
  "snarkjs": "^0.7.0",
  "circomlib": "^2.0.5",
  "circomlibjs": "^0.1.7"  // For Poseidon in Node.js
}
```

### Frontend
```json
{
  "snarkjs": "^0.7.0"  // Or use CDN
}
```

## 🚀 Quick Start (Minimal Working Version)

For hackathon, we can create a **hybrid approach**:

1. **Backend generates proof** (server-side, faster)
2. **Frontend displays QR** (with proof included)
3. **Verification agent verifies** (offline, using verification key)

This avoids browser snarkjs complexity while still having real ZK proofs.

## 📝 Implementation Priority

### Phase 1: Backend Proof Generation (Easiest)
- ✅ Compile circuit
- ✅ Generate zkey
- ✅ Implement Poseidon in Node.js
- ✅ Generate proofs server-side
- ✅ Return proof in ticket

### Phase 2: Verification (Medium)
- ✅ Load verification key
- ✅ Verify proofs using snarkjs
- ✅ Return validation result

### Phase 3: Frontend Integration (Hardest)
- ⏳ Bundle snarkjs for browser
- ⏳ Generate proofs client-side (optional)
- ⏳ Display proof status

## 🎯 Recommended Approach for Hackathon

**Option A: Server-Side Proofs (Recommended)**
- Backend generates real ZK proofs
- Frontend just displays
- Verification agent verifies
- **Pros:** Simpler, faster to implement
- **Cons:** Less "zero-knowledge" (server knows inputs)

**Option B: Client-Side Proofs (Full ZK)**
- Frontend generates proofs
- Server never sees private key
- **Pros:** True zero-knowledge
- **Cons:** Complex browser integration, slower

**Recommendation:** Start with Option A, upgrade to Option B later.

## ✅ Success Criteria

- [ ] Circuit compiles successfully
- [ ] zkey generated
- [ ] Backend can generate real ZK proofs
- [ ] Verification agent can verify proofs
- [ ] Proofs are cryptographically valid
- [ ] End-to-end flow works

## 🔗 Resources

- [Circom Documentation](https://docs.circom.io/)
- [snarkjs Documentation](https://github.com/iden3/snarkjs)
- [Circomlib Poseidon](https://github.com/iden3/circomlib/blob/master/src/poseidon.js)

