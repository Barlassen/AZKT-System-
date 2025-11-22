/**
 * Merkle Tree Implementation for AZKT
 * Creates Merkle tree of ticket commitments for ZK proof verification
 * Compatible with Hydra-S3 style Merkle path format
 */

import crypto from 'node:crypto';

// Poseidon hash simulation (for Node.js)
// In production, use actual Poseidon hash from circomlib
function poseidonHash(inputs) {
  // Simplified Poseidon-like hash for Node.js
  // In production, use circomlib's Poseidon implementation
  const data = inputs.map(i => i.toString()).join('|');
  return crypto.createHash('sha256').update(data).digest('hex');
}

export class MerkleTree {
  constructor(depth = 20) {
    this.depth = depth;
    this.leaves = [];
    this.tree = [];
    this.root = null;
  }

  /**
   * Add a commitment (leaf) to the tree
   */
  addLeaf(commitment) {
    this.leaves.push(commitment);
  }

  /**
   * Build the Merkle tree from leaves
   */
  buildTree() {
    if (this.leaves.length === 0) {
      throw new Error('No leaves to build tree');
    }

    // Convert leaves to hex strings if needed
    let currentLevel = this.leaves.map(leaf => 
      typeof leaf === 'string' ? leaf : leaf.toString()
    );

    this.tree = [currentLevel];

    // Build tree level by level
    while (currentLevel.length > 1) {
      const nextLevel = [];
      
      for (let i = 0; i < currentLevel.length; i += 2) {
        const left = currentLevel[i];
        const right = i + 1 < currentLevel.length 
          ? currentLevel[i + 1] 
          : currentLevel[i]; // Duplicate last node if odd number
        
        const hash = poseidonHash([left, right]);
        nextLevel.push(hash);
      }

      this.tree.push(nextLevel);
      currentLevel = nextLevel;
    }

    this.root = currentLevel[0];
    return this.root;
  }

  /**
   * Generate Merkle proof path for a given leaf (Hydra-S3 style)
   * Returns: { pathElements, pathIndices }
   */
  getProof(leafIndex) {
    if (leafIndex >= this.leaves.length) {
      throw new Error('Leaf index out of bounds');
    }

    const pathElements = [];
    const pathIndices = [];
    let currentIndex = leafIndex;

    for (let level = 0; level < this.tree.length - 1; level++) {
      const currentLevel = this.tree[level];
      const isRight = currentIndex % 2 === 1;
      const siblingIndex = isRight ? currentIndex - 1 : currentIndex + 1;
      
      const sibling = siblingIndex < currentLevel.length
        ? currentLevel[siblingIndex]
        : currentLevel[currentIndex]; // Duplicate if no sibling

      pathElements.push(sibling);
      pathIndices.push(isRight ? 1 : 0); // Hydra-S3 style: 0 = left, 1 = right

      currentIndex = Math.floor(currentIndex / 2);
    }

    // Pad proof to TREE_DEPTH if needed
    while (pathElements.length < this.depth) {
      pathElements.push('0');
      pathIndices.push(0);
    }

    return {
      pathElements: pathElements.slice(0, this.depth),
      pathIndices: pathIndices.slice(0, this.depth),
      // Legacy format (for backward compatibility)
      legacy: pathElements.slice(0, this.depth).map((hash, i) => ({
        hash: hash,
        isRight: pathIndices[i] === 1
      }))
    };
  }

  /**
   * Verify Merkle proof (Hydra-S3 style)
   */
  static verifyProof(leaf, pathElements, pathIndices, root) {
    let currentHash = leaf;

    for (let i = 0; i < pathElements.length; i++) {
      const isRight = pathIndices[i] === 1;
      const left = isRight ? pathElements[i] : currentHash;
      const right = isRight ? currentHash : pathElements[i];
      currentHash = poseidonHash([left, right]);
    }

    return currentHash === root;
  }

  /**
   * Get root hash
   */
  getRoot() {
    return this.root;
  }

  /**
   * Clear tree
   */
  clear() {
    this.leaves = [];
    this.tree = [];
    this.root = null;
  }
}
