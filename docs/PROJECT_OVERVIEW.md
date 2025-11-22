# AZKT Project Overview

## Problem Statement

**Current Situation:**
- Anonymous tickets can only be issued from cash ticket machines
- Print@Home tickets require name and date of birth
- Cash machines are being phased out
- Digital solutions (apps, credit cards) require personal data
- **Result**: Anonymous travel is becoming impossible

## Our Solution: AZKT

### Core Innovation

**Anonymous Zero-Knowledge Ticket System** that enables:
- ✅ Fully anonymous ticket purchase
- ✅ Zero personal data collection
- ✅ Cryptographic proof of validity
- ✅ Offline verification
- ✅ Fraud resistance

### How It Works

#### 1. Ephemeral Identity Generation
- User app generates a temporary key pair (public/private)
- Keys are single-use and discarded after ticket expiration
- No link to user's real identity

#### 2. Ticket Request & Generation
- User selects route and time
- App sends request with ephemeral public key
- SBB backend:
  - Creates ticket with unique ID
  - Generates ZK proof of validity
  - Signs ticket with SBB private key
  - Encodes everything in QR code

#### 3. Ticket Structure (QR Code)
```
{
  ticketId: "unique-id",
  route: "Lausanne → Geneva",
  validity: {
    start: "2025-01-15T14:05:00Z",
    end: "2025-01-15T15:00:00Z"
  },
  zkProof: "cryptographic-proof",
  signature: "sbb-signature",
  publicKey: "ephemeral-public-key"
}
```

#### 4. Verification Process
- Conductor scans QR code
- Verification agent (offline capable):
  - Validates ZK proof
  - Verifies SBB signature
  - Checks timestamp validity
  - Returns: VALID or INVALID
- **No identity check required**

### Technical Highlights

#### Zero-Knowledge Proofs
- Proves ticket is valid without revealing identity
- Proves ticket ownership without exposing user
- Proves time validity without personal data

#### Ephemeral Wallets
- One key pair per ticket
- Automatically deleted after expiration
- Impossible to link multiple tickets to same user

#### Offline Verification
- Works without internet connection
- Pre-loaded SBB public key
- Fast cryptographic verification

## Why This Solves SBB's Challenge

1. **Privacy-First**: Meets Swiss privacy standards
2. **Future-Proof**: Works in cashless society
3. **Cost-Effective**: Low verification overhead
4. **User-Friendly**: Simple anonymous travel
5. **Secure**: Cryptographically fraud-resistant

## Competitive Advantages

- **Non-linkable**: Each ticket is independent
- **Offline-capable**: Works without connectivity
- **Fast verification**: Cryptographic checks are instant
- **Privacy-preserving**: Zero data collection
- **Fraud-resistant**: Single-use tokens prevent reuse

## Use Cases

1. **Privacy-conscious travelers**: Don't want to share personal data
2. **Tourists**: No need for local ID or registration
3. **Cash users**: Alternative to disappearing cash machines
4. **Regulatory compliance**: Meets privacy requirements

## Future Enhancements

- Multi-ride tickets with ZK proofs
- Season passes with privacy preservation
- Integration with existing SBB systems
- Mobile wallet integration
- NFC support for faster verification

