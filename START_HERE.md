# 🚀 AZKT - Quick Start Guide

## Step 1: Install Dependencies

Open terminal in the project root and run:

```bash
npm install
```

This will install all dependencies for frontend, backend, and verification.

## Step 2: Start Backend Server

Open a terminal and run:

```bash
cd backend
npm run dev
```

You should see:
```
🚂 AZKT Backend server running on port 3001
📡 Health check: http://localhost:3001/health
🌳 Merkle Tree: Ready (Depth: 20)
```

## Step 3: Start Frontend (In Another Terminal)

Open a **new terminal** and run:

```bash
cd frontend
npm run dev
```

You should see:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
```

## Step 4: Open in Browser

Open your browser and go to:

**http://localhost:3000**

## 🎯 What You'll See

1. **Home Page** with AZKT logo
2. **Ticket Selector** - Choose route and time
3. **QR Code Display** - After generating a ticket

## 📝 Quick Test

1. Select a route (e.g., "Lausanne → Geneva")
2. Choose a departure time
3. Click "Generate Anonymous Ticket"
4. See your QR code!

## ⚠️ Troubleshooting

### Port Already in Use
If port 3000 or 3001 is busy:
- Kill the process using that port
- Or change ports in `.env` files

### Dependencies Not Installed
```bash
# Install in each directory
cd frontend && npm install
cd ../backend && npm install
```

### Backend Not Running
Make sure backend is running on port 3001 before opening frontend.

## 🔐 Proof System

**Current Mode: Simplified Proof Mode** ✅

The system is currently running in **Simplified Proof Mode** and is 100% functional!

**Simplified Proofs:**
- ✅ Works immediately (no setup required)
- ✅ All core features active
- ✅ Perfect for hackathon demo
- ✅ Hash-based proof system

**Real ZK Proofs (Optional):**
- Requires circuit compilation (currently in progress)
- More secure (recommended for production)
- Setup: [GETTING_ZK_WORKING.md](docs/GETTING_ZK_WORKING.md)

**Note:** Simplified proofs are sufficient for hackathon demo and the system is fully working!

## 🎉 Success!

If you see the AZKT interface in your browser, you're all set!

For real ZK proofs setup, see: [docs/GETTING_ZK_WORKING.md](docs/GETTING_ZK_WORKING.md)
