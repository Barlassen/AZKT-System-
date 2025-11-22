/**
 * Commitment Generator
 * Creates user commitments for Merkle tree using Poseidon hash
 */

import crypto from 'node:crypto';

/**
 * Generate user commitment from private key and ticket ID
 * commitment = Poseidon(privateKey, ticketID)
 * 
 * Note: This is a simplified version for Node.js
 * In production, use actual Poseidon hash from circomlib
 */
export function generateUserCommitment(privateKey, ticketID) {
  // Simplified Poseidon-like hash
  // In production, use circomlib's Poseidon implementation
  const data = `${privateKey}|${ticketID}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Generate nullifier for single-use guarantee
 * nullifier = Poseidon(privateKey, ticketID, nullifierSalt)
 */
export function generateNullifier(privateKey, ticketID, nullifierSalt = 123456789) {
  const data = `${privateKey}|${ticketID}|${nullifierSalt}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}

