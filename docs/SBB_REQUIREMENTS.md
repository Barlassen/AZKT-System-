# SBB Requirements Compliance

This document outlines how AZKT meets all SBB requirements from the official PDF.

## ✅ SBB Requirements Checklist

### 1. COPY-SAFE ✅
**Requirement:** Ticket cannot be copied and used by someone else.

**Our Solution:**
- Copy Protection System tracks active verifications
- If same ticket is verified simultaneously in different locations, it's detected as a copy
- QR code contains cryptographic signatures that cannot be forged
- Private key required for ticket generation (ephemeral, single-use)

**Implementation:**
- `CopyProtectionManager` class tracks active verifications
- Detects simultaneous use attempts
- Allows MULTI-CHECK (same conductor can verify multiple times)

### 2. ANONYMOUS ✅
**Requirement:** No personal data collected from user.

**Our Solution:**
- Zero personal data collection
- No name, email, phone, ID, or credit card information
- Only ephemeral cryptographic keys (single-use)
- Keys are automatically deleted after ticket expiration

**Implementation:**
- `EphemeralWallet` generates temporary key pairs
- Keys are discarded after use
- No linkability between tickets

### 3. MULTI-CHECK ✅
**Requirement:** Ticket can be verified multiple times without becoming invalid.

**Our Solution:**
- Same ticket can be verified multiple times by same conductor
- ZK proof and signature can be verified repeatedly
- Copy protection only prevents simultaneous use in different locations
- Check count is tracked but doesn't invalidate ticket

**Implementation:**
- `verifyTicket()` method supports multiple checks
- `checkCount` tracks verification count
- Copy protection allows same conductor to verify multiple times

### 4. EASY ACCESS ✅
**Requirement:** Low entry barrier, usable for non-technical users.

**Our Solution:**
- Single-screen ticket selection
- Simple form: From → To → Date → Time → Type
- No registration required
- No app installation needed (web-based)
- One-click ticket generation

**Implementation:**
- Simplified `TicketSelector` component
- Minimal user interaction required
- Clear, intuitive interface

### 5. PRINT@HOME ✅
**Requirement:** Ticket can be printed on paper at home.

**Our Solution:**
- QR code optimized for printing
- High error correction level (Level H) for paper
- Larger QR size (400px) for better print quality
- Black and white for standard printers
- QR contains all verification data

**Implementation:**
- `generateQRCode()` with `forPrint` parameter
- Error correction level 'H' for printing
- Optimized size and margins

### 6. NO PERSONAL DATA ✅
**Requirement:** Minimal data collection, no personal information.

**Our Solution:**
- Only ticket data: Start, Destination, Date, Time, Type, Price
- No user identification
- No tracking information
- Ephemeral keys (not linked to user)

**Implementation:**
- Ticket structure follows SBB format exactly
- No personal data fields
- Anonymous by design

### 7. SECURE ✅
**Requirement:** Secure against misuse and fraud.

**Our Solution:**
- Cryptographic signatures (SBB private key)
- Zero-knowledge proofs (ZK proofs)
- Merkle tree verification
- Copy protection system
- Time-limited validity

**Implementation:**
- `SBBSigner` for ticket signing
- `ZKProofGenerator` for proof generation
- `MerkleTree` for commitment verification
- `CopyProtectionManager` for copy prevention

## 📋 SBB Ticket Format

According to SBB PDF, ticket contains only:

1. **Start** - Departure station
2. **Destination** - Arrival station
3. **Date** - Travel date
4. **Time** - Departure time
5. **Ticket Type** - Single, Day Pass, etc.
6. **Price** - Price in CHF
7. **QR Code** - Control code

**No personal data included.**

## 🚫 What SBB Rejected

SBB explicitly rejected these approaches:

- ❌ SwissPass (contains personal data)
- ❌ EMV bank cards (contains personal data)
- ❌ Prepaid cards (bearer token risk, copyable)

**Our solution avoids all of these.**

## ✅ How We Meet Each Requirement

| Requirement | Solution | Status |
|------------|----------|--------|
| COPY-SAFE | Copy Protection System + Cryptographic signatures | ✅ |
| ANONYMOUS | Ephemeral wallets, zero personal data | ✅ |
| MULTI-CHECK | Multiple verification support, check count tracking | ✅ |
| EASY ACCESS | Single-screen form, no registration | ✅ |
| PRINT@HOME | High error correction QR, print-optimized | ✅ |
| NO PERSONAL DATA | SBB format only, no user info | ✅ |
| SECURE | ZK proofs, signatures, Merkle tree | ✅ |

## 🎯 Summary

AZKT fully complies with all SBB requirements:

- ✅ **COPY-SAFE**: Prevents QR copying
- ✅ **ANONYMOUS**: Zero personal data
- ✅ **MULTI-CHECK**: Multiple verifications allowed
- ✅ **EASY ACCESS**: Simple one-screen process
- ✅ **PRINT@HOME**: Print-optimized QR codes
- ✅ **SECURE**: Cryptographic security
- ✅ **LOW COST**: Minimal data = minimal security investment

All requirements from the SBB PDF are met.

