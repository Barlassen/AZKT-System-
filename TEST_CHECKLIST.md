# AZKT Test Checklist

## ✅ Pre-Test Checks

- [x] Backend running on port 3001
- [x] Frontend running on port 3000
- [x] Health check working

## 🧪 Test Steps

### 1. Open Browser
- Navigate to: **http://localhost:3000**
- Should see: AZKT homepage with ticket selector

### 2. Test Ticket Generation

#### Step 1: Select Route
- Click "From" dropdown
- Select: **Lausanne**
- "To" should auto-fill: **Geneva**

#### Step 2: Select Date & Time
- Select today's date
- Select time: **14:05**

#### Step 3: Select Ticket Type
- Choose: **Single Ticket** or **Day Pass**

#### Step 4: Generate Ticket
- Click: **"Get Anonymous Ticket"**
- Should see: Loading state
- Then: QR code displayed

### 3. Verify SBB Requirements

#### ✅ COPY-SAFE
- QR code should be displayed
- Cannot be copied and used by others
- Copy protection active

#### ✅ ANONYMOUS
- No personal data requested
- No name, email, phone fields
- Only route, date, time, type

#### ✅ MULTI-CHECK
- Ticket can be verified multiple times
- Check count tracked but doesn't invalidate

#### ✅ EASY ACCESS
- Single screen form
- Simple selections
- No registration needed

#### ✅ PRINT@HOME
- QR code visible
- Can be printed
- High error correction for paper

#### ✅ NO PERSONAL DATA
- Ticket shows: Start, Destination, Date, Time, Type, Price
- No user information

### 4. Verify Ticket Display

Check ticket shows:
- [ ] From: Lausanne
- [ ] To: Geneva
- [ ] Date: (selected date)
- [ ] Time: (selected time)
- [ ] Type: Single Ticket / Day Pass
- [ ] Price: CHF amount
- [ ] QR Code: Visible and scannable

### 5. Test Backend API

#### Health Check
```bash
curl http://localhost:3001/health
```
Expected: `{"status":"ok","service":"AZKT Backend",...}`

#### Get Routes
```bash
curl http://localhost:3001/api/routes
```
Expected: List of routes with prices

### 6. Test Error Cases

- [ ] Try submitting without selecting route → Should show error
- [ ] Try submitting without date → Should show error
- [ ] Try submitting without time → Should show error

## 🐛 Troubleshooting

### Backend Not Running
```powershell
cd backend
npm run dev
```

### Frontend Not Running
```powershell
cd frontend
npm run dev
```

### Port Already in Use
```powershell
# Find process using port
netstat -ano | findstr :3001
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F
```

## ✅ Success Criteria

- [x] Frontend loads at http://localhost:3000
- [x] Backend responds at http://localhost:3001/health
- [x] Can generate ticket
- [x] QR code displays
- [x] Ticket shows SBB format (Start, Destination, Date, Time, Type, Price)
- [x] No personal data collected
- [x] PRINT@HOME message visible

## 📝 Notes

- "Tree not initialized" in health check is normal until first ticket is created
- Merkle tree will be built when first ticket is generated
- Copy protection activates on ticket verification

