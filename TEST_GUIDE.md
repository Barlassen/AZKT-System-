# 🧪 AZKT System Test Guide

## Quick Test

### Step 1: Start Backend

Open terminal 1:
```powershell
cd backend
npm run dev
```

**Expected output:**
```
⚠️ Real ZK proof generator not available, using simplified version
🚂 AZKT Backend server running on port 3001
📡 Health check: http://localhost:3001/health
🌳 Merkle Tree: Ready (Depth: 20)
```

### Step 2: Start Frontend

Open terminal 2:
```powershell
cd frontend
npm run dev
```

**Expected output:**
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
```

### Step 3: Test in Browser

1. Open http://localhost:3000
2. You should see AZKT homepage
3. Select a route (e.g., "Lausanne → Geneva")
4. Choose departure time
5. Click "Generate Anonymous Ticket"
6. QR code should appear

## API Tests

### Health Check
```bash
curl http://localhost:3001/health
```

**Expected:**
```json
{
  "status": "ok",
  "merkleTree": {
    "depth": 20,
    "root": "..."
  }
}
```

### Generate Ticket
```bash
curl -X POST http://localhost:3001/api/ticket/request \
  -H "Content-Type: application/json" \
  -d '{
    "start": "Lausanne",
    "destination": "Geneva",
    "date": "2024-01-15",
    "time": "14:05",
    "ticketType": "single",
    "price": 15.00,
    "publicKey": "test_key",
    "userPrivateKey": "test_private"
  }'
```

**Expected:**
```json
{
  "success": true,
  "ticket": {
    "ticketId": "...",
    "qrCode": "data:image/png;base64,...",
    "zkProof": {
      "type": "simplified_zk_proof",
      ...
    }
  }
}
```

### Verify Ticket
```bash
curl -X POST http://localhost:3001/api/ticket/verify \
  -H "Content-Type: application/json" \
  -d '{
    "ticketData": {...},
    "qrCode": "data:image/png;base64,..."
  }'
```

## Verification Agent Test

### Start Verification Agent
```powershell
cd verification
npm run dev
```

**Expected:**
```
✅ AZKT Verification Agent running on port 3002
🔑 SBB Public Key: Loaded
```

### Verify QR Code
```bash
curl -X POST http://localhost:3002/verify \
  -H "Content-Type: application/json" \
  -d '{
    "qrData": "..."
  }'
```

## Test Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Health check returns OK
- [ ] Can generate ticket via API
- [ ] Can generate ticket via frontend
- [ ] QR code is generated
- [ ] QR code can be verified
- [ ] Simplified proof is generated
- [ ] Merkle tree is working
- [ ] Copy protection is active

## Troubleshooting

### Port Already in Use
```powershell
# Find process using port
netstat -ano | findstr :3001
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Dependencies Missing
```powershell
cd backend && npm install
cd ../frontend && npm install
```

### Backend Not Starting
- Check if port 3001 is free
- Check if all dependencies are installed
- Check backend logs for errors

### Frontend Not Starting
- Check if port 3000 is free
- Check if backend is running
- Check frontend logs for errors

## Success Criteria

✅ All services start without errors  
✅ Can generate tickets  
✅ QR codes are valid  
✅ Verification works  
✅ Simplified proofs are generated  

## Next Steps

After successful test:
1. System is ready for demo
2. Can proceed with hackathon presentation
3. Real ZK proofs can be added later (optional)

