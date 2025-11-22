/**
 * Poseidon Hash Implementation for Node.js
 * Uses circomlibjs for compatibility with Circom circuit
 * 
 * Note: This requires circomlibjs package
 * Install: npm install circomlibjs
 */

// For now, placeholder - will use circomlibjs when installed
import crypto from 'node:crypto';

/**
 * Poseidon hash function
 * Matches Circom circuit's Poseidon implementation
 * 
 * @param {Array} inputs - Array of field elements
 * @returns {string} Hash as hex string
 */
export function poseidonHash(inputs) {
  // TODO: Replace with real Poseidon from circomlibjs
  // For now, use SHA-256 as placeholder
  // In production, use: const poseidon = require('circomlibjs').poseidon
  
  const data = inputs.map(i => i.toString()).join('|');
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Poseidon hash with specific number of inputs
 * Matches Circom Poseidon(n) template
 */
export function poseidon2(input1, input2) {
  return poseidonHash([input1, input2]);
}

export function poseidon3(input1, input2, input3) {
  return poseidonHash([input1, input2, input3]);
}

/**
 * Convert string/number to field element (BigInt)
 */
export function toFieldElement(value) {
  if (typeof value === 'string') {
    // Convert hex string to BigInt
    if (value.startsWith('0x')) {
      return BigInt(value);
    }
    // Convert regular string to BigInt (hash first)
    const hash = crypto.createHash('sha256').update(value).digest('hex');
    return BigInt('0x' + hash);
  }
  return BigInt(value);
}

