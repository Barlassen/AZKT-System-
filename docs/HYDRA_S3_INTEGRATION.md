# Hydra-S3 Integration

## ✅ What We Did

We've integrated Hydra-S3's proving scheme logic into AZKT:

1. **Hydra-S3 Style Merkle Path Verifier**
   - File: `contracts/circuits/common/verify-merkle-path.circom`
   - Based on Hydra-S3's VerifyMerklePath template
   - Uses pathElements and pathIndices (not [hash, isRight] pairs)

2. **Hydra-S3 Inspired Circuit**
   - File: `contracts/circuits/TicketOwnership_HydraS3.circom`
   - Follows Hydra-S3's commitment and proof structure
   - Simplified for ticket ownership (no vault, no accounts tree)

3. **Backend Merkle Tree**
   - Updated to generate Hydra-S3 style proofs
   - Returns: `{ pathElements, pathIndices }`
   - Backward compatible with legacy format

## 📋 Hydra-S3 Concepts Used

### 1. Commitment Creation
```circom
userCommitment = Poseidon(privateKey, ticketID)
```
Similar to Hydra-S3's: `commitment = Poseidon(secret, identifier)`

### 2. Merkle Proof Format
**Hydra-S3 Style:**
- `pathElements[depth]` - Array of sibling hashes
- `pathIndices[depth]` - Array of 0/1 (left/right)

**Our Implementation:**
- Uses same format
- Compatible with Hydra-S3's VerifyMerklePath

### 3. Nullifier
```circom
nullifier = Poseidon(privateKey, ticketID, salt)
```
Similar to Hydra-S3's proofIdentifier concept

## 🔄 Migration from Custom to Hydra-S3 Style

### Old Format (Custom):
```javascript
merkleProof: [
  { hash: "0xabc", isRight: false },
  { hash: "0xdef", isRight: true }
]
```

### New Format (Hydra-S3):
```javascript
merkleProof: {
  pathElements: ["0xabc", "0xdef"],
  pathIndices: [0, 1]  // 0 = left, 1 = right
}
```

## 📁 Files Updated

1. `contracts/circuits/TicketOwnership_HydraS3.circom` - New Hydra-S3 style circuit
2. `contracts/circuits/common/verify-merkle-path.circom` - Hydra-S3 style verifier
3. `backend/src/merkle/merkleTree.js` - Generates Hydra-S3 format proofs
4. `backend/src/ticket/ticket.js` - Uses Hydra-S3 format
5. `backend/src/zk/snarkjsProof.js` - Handles Hydra-S3 format

## 🎯 Benefits

- ✅ Battle-tested Merkle path verification
- ✅ Compatible with Hydra-S3 ecosystem
- ✅ Standard format (easier to audit)
- ✅ Better performance (optimized templates)

## 📝 Usage

### Compile Hydra-S3 Style Circuit:
```bash
cd contracts
circom circuits/TicketOwnership_HydraS3.circom --r1cs --wasm --sym -o build
```

### Use in Backend:
Backend automatically uses Hydra-S3 format when generating proofs.

## 🔗 References

- [Hydra-S3 Circuit](https://github.com/sismo-core/hydra-s3-zkps/blob/main/circuits/hydra-s3.circom)
- [Hydra-S3 Documentation](https://docs.sismo.io/sismo-docs/technical-concepts/hydra-zk-proving-schemes)
