# AZKT Setup Guide

## Prerequisites

- Node.js 18+ and npm
- Git

## Installation

### 1. Install Dependencies

From the root directory:

```bash
npm install
```

Or install in each workspace:

```bash
cd frontend && npm install
cd ../backend && npm install
cd ../verification && npm install
```

### 2. Environment Variables

#### Backend (.env)

Create `backend/.env`:

```env
PORT=3001
SBB_PRIVATE_KEY=your_sbb_private_key_base64
SBB_PUBLIC_KEY=your_sbb_public_key_base64
```

**Note**: For development, keys will be auto-generated if not provided.

#### Verification Agent (.env)

Create `verification/.env`:

```env
PORT=3002
SBB_PUBLIC_KEY=your_sbb_public_key_base64
```

**Important**: The verification agent needs the SBB public key to verify tickets offline.

#### Frontend (.env.local)

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

## Running the System

### Development Mode

#### Option 1: Run All Services (from root)

```bash
npm run dev
```

#### Option 2: Run Individually

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - Verification Agent:**
```bash
cd verification
npm run dev
```

### Production Build

```bash
npm run build
```

## Testing the System

### 1. Start Backend
```bash
cd backend && npm run dev
```

### 2. Start Frontend
```bash
cd frontend && npm run dev
```

### 3. Open Browser
Navigate to `http://localhost:3000`

### 4. Test Flow
1. Select a route (e.g., Lausanne → Geneva)
2. Choose departure time
3. Click "Generate Anonymous Ticket"
4. QR code will be displayed
5. Copy ticket data and test with verification agent

### 5. Test Verification
```bash
cd verification
# Use the /api/verify endpoint with ticket data
```

## API Endpoints

### Backend (Port 3001)

- `GET /health` - Health check
- `GET /api/routes` - Get available routes
- `POST /api/ticket/request` - Request new ticket
- `POST /api/ticket/verify` - Verify ticket
- `GET /api/public-key` - Get SBB public key info

### Verification Agent (Port 3002)

- `GET /health` - Health check
- `POST /api/verify` - Verify ticket
- `POST /api/decode-qr` - Decode and verify QR code

## Troubleshooting

### Port Already in Use
Change ports in `.env` files or kill existing processes.

### Missing Dependencies
Run `npm install` in each workspace directory.

### QR Code Not Displaying
Check browser console for errors. Ensure backend is running.

### Verification Fails
Ensure SBB public key is loaded in verification agent.

## Next Steps

- [ ] Implement full ZK circuits (Circom/SnarkJS)
- [ ] Add database for ticket tracking (optional, for analytics)
- [ ] Implement payment integration (anonymous payment method)
- [ ] Add mobile app version
- [ ] Deploy to production

