# AZKT Demo Script

## Pre-Demo Setup

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Start verification agent: `cd verification && npm run dev`
4. Open browser: `http://localhost:3000`
5. Test all flows before presentation

## Demo Flow (5 minutes)

### Step 1: Introduction (30 seconds)
"Let me show you AZKT in action. This is a fully anonymous ticketing system."

### Step 2: Open App (10 seconds)
- Open browser to `http://localhost:3000`
- Show clean interface
- "Notice: no login, no registration, no personal data required"

### Step 3: Generate Wallet (10 seconds)
- Point out: "Ephemeral wallet automatically generated"
- "This is a single-use key pair. It will be deleted after the ticket expires."

### Step 4: Select Ticket (30 seconds)
- Click "Select Your Ticket"
- Show route options: "Lausanne → Geneva, Zurich → Bern, etc."
- Select "Lausanne → Geneva"
- Choose departure time
- "All anonymous. No name, no email, no phone number."

### Step 5: Generate Ticket (20 seconds)
- Click "Generate Anonymous Ticket"
- Show loading state
- "The backend is creating a ticket with a ZK proof and SBB signature."

### Step 6: Display QR Code (30 seconds)
- Show QR code
- Point out ticket details:
  - Route: Lausanne → Geneva
  - Validity time
  - Ticket ID
  - Security features (ZK Proof, Signature)
- "This QR code contains everything needed for verification."

### Step 7: Verification (1 minute)
- Open verification agent interface or use API
- Copy ticket data
- Show verification process:
  - "ZK proof verified ✓"
  - "SBB signature verified ✓"
  - "Timestamp valid ✓"
  - "Result: VALID"
- "Notice: no identity check. The conductor doesn't know who you are."

### Step 8: Privacy Highlight (30 seconds)
- Show ephemeral wallet status
- "After expiration, this wallet and ticket are automatically deleted."
- "SBB cannot link this ticket to any other ticket or user."

### Step 9: Offline Capability (20 seconds)
- "The verification works offline. No internet needed."
- "Perfect for tunnels, remote areas, or network issues."

### Step 10: Summary (30 seconds)
- "That's AZKT: anonymous, secure, and practical."
- "Zero personal data, cryptographic security, offline verification."

## Backup Plans

### If Demo Fails

1. **Backend not running**: Show screenshots/video
2. **QR code not displaying**: Explain the flow verbally
3. **Verification error**: Show code/architecture instead
4. **Network issues**: Emphasize offline capability

### Alternative Demo

If live demo doesn't work:
1. Show architecture diagram
2. Walk through code structure
3. Explain cryptographic flow
4. Show verification logic

## Key Points to Emphasize

1. **Zero Personal Data**: No name, email, phone, ID
2. **Ephemeral Keys**: One per ticket, auto-deleted
3. **ZK Proofs**: Prove validity without identity
4. **Offline Verification**: Works without internet
5. **Fraud-Resistant**: Cryptographic security

## Closing Statement

"AZKT solves the anonymous ticket challenge with a privacy-preserving, secure, and practical solution. It's ready for the future of cashless public transport."

