# Circuit Structure

## Single Circuit Architecture

We use **one main circuit** based on Hydra-S3 principles:

### Main Circuit
- **File**: `contracts/circuits/TicketOwnership.circom`
- **Based on**: Hydra-S3 proving scheme
- **Purpose**: Prove ticket ownership without revealing identity

### Supporting Components
- **File**: `contracts/circuits/common/verify-merkle-path.circom`
- **Purpose**: Hydra-S3 style Merkle path verification

## Circuit Details

### Inputs

**Private Inputs:**
- `privateKey` - Ephemeral wallet's private key
- `ticketCommitmentPathElements[TREE_DEPTH]` - Merkle path elements
- `ticketCommitmentPathIndices[TREE_DEPTH]` - Merkle path indices (0=left, 1=right)

**Public Inputs:**
- `merkleRoot` - Merkle root of valid tickets
- `ticketID` - Public ticket identifier

### Outputs
- `isValid` - Returns 1 if proof is valid

### Process

1. **Commitment Creation**: `Poseidon(privateKey, ticketID)`
2. **Merkle Proof Verification**: Verify commitment is in tree
3. **Nullifier Generation**: `Poseidon(privateKey, ticketID, salt)` for single-use guarantee

## Compilation

```bash
cd contracts
npm install
circom circuits/TicketOwnership.circom --r1cs --wasm --sym -o build
```

## Why Single Circuit?

✅ **Simplicity**: One circuit = easier to understand  
✅ **Hydra-S3 Proven**: Based on battle-tested design  
✅ **Standard Format**: Compatible with ZK ecosystem  
✅ **Maintainable**: Less code to maintain

## Migration History

- **Before**: Two circuits (custom + Hydra-S3)
- **Now**: Single Hydra-S3 based circuit
- **Result**: Cleaner, more maintainable codebase

