/**
 * Merkle Tree Verifier (for verification agent)
 * Simplified version for offline verification
 */

import crypto from 'crypto';

// Poseidon hash simulation (for Node.js)
function poseidonHash(inputs) {
  const data = inputs.map(i => i.toString()).join('|');
  return crypto.createHash('sha256').update(data).digest('hex');
}

export class MerkleTree {
  /**
   * Verify Merkle proof
   */
  static verifyProof(leaf, proofPath, root) {
    let currentHash = leaf;

    for (const node of proofPath) {
      const left = node.isRight ? node.hash : currentHash;
      const right = node.isRight ? currentHash : node.hash;
      currentHash = poseidonHash([left, right]);
    }

    return currentHash === root;
  }
}

