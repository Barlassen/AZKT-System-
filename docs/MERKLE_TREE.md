# Merkle Tree System Documentation

## Overview

The AZKT system uses a Merkle Tree to prove that a ticket commitment is included in SBB's list of valid tickets, without revealing which specific ticket it is.

## Architecture

### Tree Structure

```
                    Merkle Root (MR)
                         |
            +------------+------------+
            |                         |
        Level 1                    Level 1
            |                         |
      +-----+-----+             +-----+-----+
      |           |             |           |
   Level 2     Level 2      Level 2     Level 2
      |           |             |           |
   Leaf 1      Leaf 2       Leaf 3      Leaf 4
 (Commitment) (Commitment) (Commitment) (Commitment)
```

### Components

1. **Leaf Nodes**: User commitments (`userCommitment = Poseidon(privateKey, ticketID)`)
2. **Internal Nodes**: Hash of child nodes
3. **Root**: Merkle root (MR) - publicly available
4. **Proof Path**: Path from leaf to root

## Flow

### 1. Ticket Generation (Backend)

```javascript
// User sends: userPublicKey, userPrivateKey, route, time
// Backend:
1. Generate ticketID
2. Calculate userCommitment = Poseidon(privateKey, ticketID)
3. Add commitment to Merkle tree
4. Build tree and get merkleRoot
5. Generate Merkle proof path
6. Return: ticket, merkleRoot, merkleProof
```

### 2. ZK Proof Generation (Client)

```javascript
// Client receives: merkleRoot, merkleProof
// Client:
1. Load Circom circuit
2. Generate witness with:
   - privateKey (secret)
   - ticketCommitmentPath (from merkleProof)
   - merkleRoot (public)
   - ticketID (public)
3. Generate ZK proof using snarkjs
4. Include proof in ticket QR code
```

### 3. Verification (Conductor)

```javascript
// Conductor scans QR code
1. Verify SBB signature
2. Verify ZK proof (using snarkjs)
3. Verify Merkle proof path
4. Check timestamp
5. Check nullifier (if available)
6. Return: VALID / INVALID
```

## Merkle Proof Structure

```javascript
merkleProof = [
  {
    hash: "0xabc...",  // Sibling hash
    isRight: false     // Position (left/right)
  },
  {
    hash: "0xdef...",
    isRight: true
  },
  // ... more nodes up to TREE_DEPTH
]
```

## Security Properties

1. **Privacy**: Merkle proof doesn't reveal other tickets
2. **Efficiency**: O(log n) proof size
3. **Verifiability**: Anyone can verify proof with merkleRoot
4. **Immutability**: Changing any leaf changes root

## Implementation Notes

- **Tree Depth**: 20 levels (supports 2^20 = ~1M tickets)
- **Hash Function**: Poseidon (ZK-friendly)
- **Proof Size**: ~20 nodes × 2 fields = 40 elements
- **Verification**: O(log n) hash operations

## API Endpoints

### Get Merkle Root
```
GET /api/merkle-root
Response: { merkleRoot: "0x..." }
```

### Ticket Request (includes Merkle proof)
```
POST /api/ticket/request
Response: {
  ticket: {...},
  zkProofData: {
    merkleRoot: "0x...",
    merkleProof: [...]
  }
}
```

## Future Enhancements

1. **Incremental Updates**: Add/remove tickets without rebuilding
2. **Batch Updates**: Update multiple tickets at once
3. **Sparse Merkle Trees**: More efficient for large sets
4. **Tree Pruning**: Remove expired tickets

