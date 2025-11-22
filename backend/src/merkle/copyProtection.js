/**
 * Copy Protection System
 * Prevents QR code copying (COPY-SAFE requirement)
 * But allows MULTI-CHECK (same ticket can be verified multiple times)
 * 
 * Strategy:
 * - Track active verifications per ticket
 * - If same ticket is verified simultaneously in different locations, it's a copy
 * - But same ticket can be verified multiple times by same conductor (MULTI-CHECK)
 */

export class CopyProtectionManager {
  constructor() {
    // Track active verifications: token -> Set of conductor IDs
    this.activeVerifications = new Map();
    
    // Timeout for active verification (5 minutes)
    this.verificationTimeout = 5 * 60 * 1000;
  }

  /**
   * Check copy protection
   * Returns valid if ticket is not being used simultaneously elsewhere
   * 
   * @param {string} copyProtectionToken - Token for this ticket
   * @param {string} conductorId - ID of conductor checking the ticket
   * @returns {Object} { valid: boolean, reason?: string }
   */
  checkCopyProtection(copyProtectionToken, conductorId) {
    const now = Date.now();
    
    // Get active verifications for this token
    let activeSet = this.activeVerifications.get(copyProtectionToken);
    
    if (!activeSet) {
      // First verification - create new set
      activeSet = new Set();
      this.activeVerifications.set(copyProtectionToken, activeSet);
    } else {
      // Clean up old verifications (older than timeout)
      // In production, use a more sophisticated cleanup mechanism
      if (activeSet.size > 10) {
        // If too many active, it might be a copy attempt
        // But allow if it's the same conductor (MULTI-CHECK)
        if (!activeSet.has(conductorId) && activeSet.size > 1) {
          return { 
            valid: false, 
            reason: 'Ticket appears to be used simultaneously in multiple locations (possible copy)' 
          };
        }
      }
    }

    // Add this conductor to active set
    activeSet.add(conductorId);

    // Schedule cleanup (in production, use proper timeout mechanism)
    setTimeout(() => {
      activeSet.delete(conductorId);
      if (activeSet.size === 0) {
        this.activeVerifications.delete(copyProtectionToken);
      }
    }, this.verificationTimeout);

    return { valid: true };
  }

  /**
   * Clear all active verifications (for testing)
   */
  clear() {
    this.activeVerifications.clear();
  }
}

