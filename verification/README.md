# AZKT Verification Agent

Offline-capable ticket verification system for conductors.

## Features

- QR code scanning
- Offline ZK proof verification
- Signature validation
- Timestamp checking
- VALID/INVALID response

## Tech Stack

- Node.js
- QR Code decoding
- TweetNaCl for signature verification
- Offline-first design

## Development

```bash
npm install
npm run dev
```

## Usage

1. Scan QR code from ticket
2. Decode ticket data
3. Verify ZK proof
4. Verify SBB signature
5. Check timestamp validity
6. Return result

## Offline Capability

- Pre-loaded SBB public key
- No internet connection required
- Fast cryptographic verification
- Works in tunnels, remote areas

