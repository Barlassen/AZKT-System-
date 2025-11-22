/**
 * Nullifier System
 * Prevents double-spending and ensures single-use tickets
 */

export class NullifierManager {
  constructor() {
    this.usedNullifiers = new Set();
  }

  /**
   * Check if nullifier has been used
   */
  isUsed(nullifier) {
    return this.usedNullifiers.has(nullifier);
  }

  /**
   * Mark nullifier as used
   */
  markUsed(nullifier) {
    if (this.isUsed(nullifier)) {
      throw new Error('Nullifier already used - ticket cannot be reused');
    }
    this.usedNullifiers.add(nullifier);
  }

  /**
   * Verify nullifier is not used
   */
  verifyNotUsed(nullifier) {
    if (this.isUsed(nullifier)) {
      return { valid: false, reason: 'Ticket already used (nullifier exists)' };
    }
    return { valid: true };
  }

  /**
   * Get all used nullifiers (for debugging)
   */
  getUsedNullifiers() {
    return Array.from(this.usedNullifiers);
  }

  /**
   * Clear nullifiers (for testing)
   */
  clear() {
    this.usedNullifiers.clear();
  }
}

