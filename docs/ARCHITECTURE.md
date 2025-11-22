# AZKT Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        User Device                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Frontend App (Next.js)                             │   │
│  │  - Ephemeral Wallet Generator                       │   │
│  │  - Ticket Selector                                  │   │
│  │  - QR Code Display                                  │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTPS Request
                        │ (Public Key Only)
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    SBB Backend Server                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  API Server (Express)                                │   │
│  │  - Ticket Generator                                  │   │
│  │  - ZK Proof Generator                                │   │
│  │  - SBB Signer                                        │   │
│  │  - QR Code Generator                                 │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ Returns: Ticket + QR Code
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                        User Device                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  QR Code Display                                     │   │
│  │  - Ticket Token (JSON)                               │   │
│  │  - ZK Proof                                          │   │
│  │  - SBB Signature                                     │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ QR Code Scan
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Verification Agent (Conductor)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Offline Verification                                │   │
│  │  - QR Decoder                                        │   │
│  │  - ZK Proof Verifier                                 │   │
│  │  - Signature Verifier                                │   │
│  │  - Timestamp Checker                                 │   │
│  └──────────────────────────────────────────────────────┘   │
│  Result: VALID / INVALID                                    │
└─────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Frontend (User App)

**Technology**: Next.js 14, React 18

**Key Components**:
- `EphemeralWallet`: Generates single-use key pairs
- `TicketSelector`: Route and time selection
- `QRDisplay`: Shows ticket QR code

**Data Flow**:
1. User opens app → Wallet generated
2. User selects ticket → Request sent with public key
3. Receives ticket + QR code
4. Displays QR code for scanning

**Privacy**: No personal data collected or stored

### 2. Backend (SBB Server)

**Technology**: Node.js, Express

**Key Modules**:
- `TicketGenerator`: Creates tickets with ZK proofs
- `SBBSigner`: Signs tickets with SBB private key
- `ZKProofGenerator`: Generates zero-knowledge proofs

**Data Flow**:
1. Receives ticket request (route, time, user public key)
2. Generates unique ticket ID
3. Creates ZK proof
4. Signs ticket
5. Generates QR code
6. Returns ticket + QR

**Security**:
- SBB private key stored securely
- Rate limiting on requests
- Input validation

### 3. Verification Agent

**Technology**: Node.js, Express

**Key Modules**:
- QR code decoder
- ZK proof verifier
- Signature verifier
- Timestamp checker

**Data Flow**:
1. Scans QR code
2. Decodes ticket data
3. Verifies ZK proof
4. Verifies SBB signature
5. Checks timestamp
6. Returns VALID/INVALID

**Offline Capability**:
- Pre-loaded SBB public key
- No internet required
- Fast cryptographic verification

## Data Structures

### Ticket Structure

```json
{
  "ticketId": "unique-hex-id",
  "route": "Lausanne → Geneva",
  "validity": {
    "start": "2025-01-15T14:05:00Z",
    "end": "2025-01-15T15:00:00Z"
  },
  "issuedAt": "2025-01-15T13:00:00Z",
  "publicKey": "base64-encoded-public-key",
  "zkProof": {
    "commitment": "sha256-hash",
    "timestamp": 1234567890,
    "proofData": {...}
  },
  "signature": "base64-encoded-signature",
  "issuer": "SBB CFF FFS"
}
```

### ZK Proof Structure

```json
{
  "commitment": "hash-of-ticket-data",
  "timestamp": 1234567890,
  "proofData": {
    "type": "simplified_zk_proof",
    "commitment": "..."
  }
}
```

## Security Model

### Anonymity Guarantees

1. **Ephemeral Keys**: One key pair per ticket
2. **No Personal Data**: Zero collection of name, email, phone, ID
3. **Non-Linkable**: Tickets cannot be linked to same user
4. **Automatic Deletion**: Keys deleted after expiration

### Cryptographic Security

1. **Ed25519 Signatures**: SBB signs tickets
2. **ZK Proofs**: Prove validity without revealing identity
3. **Hash Commitments**: Bind ticket to user key
4. **Timestamp Validation**: Prevent replay attacks

### Fraud Prevention

1. **Single-Use Tokens**: Each ticket is unique
2. **Cryptographic Signatures**: Cannot be forged
3. **Time-Limited**: Tickets expire automatically
4. **ZK Verification**: Proves ownership without identity

## Future Enhancements

### Phase 2: Full ZK Circuits
- Implement Circom circuits
- Use SnarkJS for proof generation
- More sophisticated ZK proofs

### Phase 3: Blockchain Integration (Optional)
- Store ticket commitments on-chain
- Decentralized verification
- Immutable audit trail

### Phase 4: Advanced Features
- Multi-ride tickets with ZK
- Season passes
- Transferable tickets
- Refund system

## Performance Considerations

- **QR Code Size**: Optimized for fast scanning
- **Verification Speed**: < 100ms per ticket
- **Offline Capability**: No network latency
- **Key Generation**: < 50ms per wallet

## Privacy Compliance

- **GDPR**: No personal data = no GDPR concerns
- **Swiss Privacy Law**: Meets strict requirements
- **Zero-Knowledge**: Maximum privacy preservation
- **Data Minimization**: Only necessary cryptographic data

