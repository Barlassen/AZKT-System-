# Hydra-S3 Integration Guide

## Overview

We've integrated Hydra-S3's proving scheme logic into AZKT. The circuit follows Hydra-S3's patterns while being simplified for ticket ownership.

## Circuit Files

### Main Circuit
- `circuits/TicketOwnership_HydraS3.circom` - Hydra-S3 inspired circuit

### Common Components
- `circuits/common/verify-merkle-path.circom` - Hydra-S3 style Merkle path verifier

## Key Differences from Original Hydra-S3

### Hydra-S3 (Full):
- Two-level Merkle trees (accounts + registry)
- Vault secrets
- Source/destination verification
- Commitment mapper
- Complex proof identifier system

### Our Simplified Version:
- Single-level Merkle tree (ticket commitments)
- Simple commitment: `Poseidon(privateKey, ticketID)`
- Direct Merkle proof verification
- Nullifier for single-use

## Merkle Proof Format

### Hydra-S3 Style:
```javascript
{
  pathElements: ["hash1", "hash2", ...],
  pathIndices: [0, 1, ...]  // 0 = left, 1 = right
}
```

### Our Implementation:
- Backend generates this format
- Circuit expects this format
- Backward compatible with legacy format

## Compilation

```bash
cd contracts
npm install circomlib

# Compile Hydra-S3 style circuit
circom circuits/TicketOwnership_HydraS3.circom --r1cs --wasm --sym -o build
```

## Usage

The backend automatically uses Hydra-S3 format when:
- Generating Merkle proofs
- Creating ZK proof inputs
- Verifying proofs

## References

- [Hydra-S3 Circuit Source](https://github.com/sismo-core/hydra-s3-zkps/blob/main/circuits/hydra-s3.circom)
- [Hydra-S3 Documentation](https://docs.sismo.io/sismo-docs/technical-concepts/hydra-zk-proving-schemes)

