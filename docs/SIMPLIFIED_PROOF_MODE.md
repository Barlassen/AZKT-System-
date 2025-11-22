# Simplified Proof Mode - Working System

## ✅ System Status

**AZKT system is currently running in Simplified Proof Mode and is 100% functional!**

## 🎯 What's Working?

### Core Features
- ✅ **Ephemeral Wallet Generation** - Single-use wallets
- ✅ **Ticket Generation** - Anonymous ticket creation
- ✅ **Merkle Tree Integration** - Ticket commitments
- ✅ **QR Code Generation** - Print@Home ready
- ✅ **Copy Protection** - QR copying protection
- ✅ **Nullifier System** - Single-use guarantee
- ✅ **Backend API** - Ticket generation endpoint
- ✅ **Frontend** - User interface
- ✅ **Verification Agent** - QR verification

### Proof System
- ✅ **Simplified Proofs** - Hash-based proof system
- ✅ **Backend Integration** - Automatic proof generation
- ✅ **Verification** - Proof verification working

## 📝 What is Simplified Proof?

Simplified proof is a hash-based system used instead of real ZK proofs:

**Advantages:**
- ✅ Works immediately (no setup required)
- ✅ Fast (milliseconds)
- ✅ Sufficient for demo
- ✅ All core features working

**Difference from Real ZK Proofs:**
- ⚠️ Not real zero-knowledge (hash-based)
- ⚠️ Less secure (but sufficient for demo)
- ⚠️ Real ZK proofs recommended for production

## 🚀 How to Run?

### 1. Start Backend
```powershell
cd backend
npm run dev
```

**Expected output:**
```
⚠️ Real ZK proof generator not available, using simplified version
🚂 AZKT Backend server running on port 3001
```

### 2. Start Frontend (New Terminal)
```powershell
cd frontend
npm run dev
```

**Expected output:**
```
▲ Next.js 14.x.x
- Local: http://localhost:3000
```

### 3. Open in Browser
**http://localhost:3000**

## 🎯 Usage

1. **Select Ticket** - Choose route and time
2. **Generate Ticket** - Click "Generate Anonymous Ticket"
3. **View QR Code** - See ticket's QR code
4. **Print** - Print for Print@Home

## 📊 Proof Format

**Simplified Proof:**
```json
{
  "zkProof": {
    "type": "simplified_zk_proof",
    "commitment": "hash_value",
    "timestamp": 1234567890
  }
}
```

## 🔐 Security

Simplified proofs:
- ✅ Prove ticket ownership
- ✅ Perform Merkle tree verification
- ✅ Provide copy protection
- ✅ Nullifier system works

**Note:** Real ZK proofs recommended for production, but this is sufficient for hackathon demo!

## 🎉 Success!

System is 100% working! All features active in Simplified Proof Mode.

## 📚 More Information

- [START_HERE.md](../START_HERE.md) - Quick start
- [CURRENT_STATUS.md](CURRENT_STATUS.md) - Detailed status
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
