/**
 * ZK Proof Verifier
 * Verifies zero-knowledge proofs for tickets
 * Supports both simplified (hackathon) and full Circom proofs
 */

import crypto from 'crypto';

export class ZKProofVerifier {
  /**
   * Verify a ZK proof (simplified or full)
   */
  static verifyProof(proof, ticketData, userPublicKey) {
    // Check if this is a full ZK proof (from snarkjs) or simplified
    if (proof.proof && proof.publicSignals) {
      // Full ZK proof from snarkjs
      return this.verifyFullZKProof(proof, ticketData);
    } else {
      // Simplified proof (for hackathon demo)
      return this.verifySimplifiedProof(proof, ticketData, userPublicKey);
    }
  }

  /**
   * Verify full ZK proof from snarkjs
   * In production, this would use snarkjs to verify
   */
  static verifyFullZKProof(proof, ticketData) {
    // TODO: Implement actual snarkjs verification
    // For now, placeholder
    console.warn('Full ZK proof verification requires snarkjs setup');
    
    // Verify public signals match
    const expectedMerkleRoot = ticketData.merkleRoot;
    const expectedTicketID = ticketData.ticketId;
    
    if (proof.publicSignals[0] !== expectedMerkleRoot) {
      return { valid: false, reason: 'Merkle root mismatch in proof' };
    }
    
    if (proof.publicSignals[1] !== expectedTicketID) {
      return { valid: false, reason: 'Ticket ID mismatch in proof' };
    }
    
    if (proof.publicSignals[2] !== '1') {
      return { valid: false, reason: 'Proof validation failed' };
    }
    
    return { valid: true };
  }

  /**
   * Verify simplified proof (commitment-based)
   */
  static verifySimplifiedProof(proof, ticketData, userPublicKey) {
    // Verify commitment matches
    const expectedCommitment = this.createCommitment(ticketData, userPublicKey);
    
    if (proof.commitment !== expectedCommitment) {
      return { valid: false, reason: 'Commitment mismatch' };
    }

    // Verify Merkle proof if available
    if (ticketData.merkleProof && ticketData.merkleRoot) {
      const merkleValid = this.verifyMerkleProof(
        ticketData.userCommitment,
        ticketData.merkleProof,
        ticketData.merkleRoot
      );
      
      if (!merkleValid) {
        return { valid: false, reason: 'Merkle proof invalid' };
      }
    }

    return { valid: true };
  }

  /**
   * Create a commitment (hash) of ticket + user key
   * Must match the backend implementation
   */
  static createCommitment(ticketData, userPublicKey) {
    const data = JSON.stringify({
      ticketId: ticketData.ticketId,
      route: ticketData.route,
      validity: ticketData.validity,
      publicKey: userPublicKey
    });
    
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Verify Merkle proof (supports both Hydra-S3 and legacy format)
   */
  static verifyMerkleProof(leaf, proofPath, root) {
    let currentHash = leaf;

    // Check if Hydra-S3 format (object with pathElements and pathIndices)
    if (proofPath && typeof proofPath === 'object' && proofPath.pathElements) {
      // Hydra-S3 format: { pathElements: [...], pathIndices: [...] }
      const { pathElements, pathIndices } = proofPath;
      
      for (let i = 0; i < pathElements.length; i++) {
        const isRight = pathIndices[i] === 1;
        const left = isRight ? pathElements[i] : currentHash;
        const right = isRight ? currentHash : pathElements[i];
        
        // Use Poseidon-like hash (simplified for Node.js)
        const data = `${left}|${right}`;
        currentHash = crypto.createHash('sha256').update(data).digest('hex');
      }
    } else {
      // Legacy format: array of {hash, isRight}
      for (const node of proofPath) {
        const left = node.isRight ? node.hash : currentHash;
        const right = node.isRight ? currentHash : node.hash;
        
        // Use Poseidon-like hash (simplified for Node.js)
        const data = `${left}|${right}`;
        currentHash = crypto.createHash('sha256').update(data).digest('hex');
      }
    }

    return currentHash === root;
  }
}

// Export for backward compatibility
export const ZKProofGenerator = ZKProofVerifier;
