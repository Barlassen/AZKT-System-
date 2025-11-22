/**
 * Ephemeral Wallet Manager
 * Generates single-use key pairs for anonymous tickets
 */

import nacl from 'tweetnacl';
import pkg from 'tweetnacl-util';
const { encodeBase64, decodeBase64 } = pkg;

export class EphemeralWallet {
  constructor() {
    this.keyPair = null;
    this.createdAt = null;
  }

  /**
   * Generate a new ephemeral key pair
   * This is called once per ticket
   */
  generate() {
    this.keyPair = nacl.sign.keyPair();
    this.createdAt = Date.now();
    
    return {
      publicKey: encodeBase64(this.keyPair.publicKey),
      privateKey: encodeBase64(this.keyPair.secretKey),
      createdAt: this.createdAt
    };
  }

  /**
   * Get public key (safe to share)
   */
  getPublicKey() {
    if (!this.keyPair) {
      throw new Error('Wallet not initialized. Call generate() first.');
    }
    return encodeBase64(this.keyPair.publicKey);
  }

  /**
   * Sign a message with the private key
   */
  sign(message) {
    if (!this.keyPair) {
      throw new Error('Wallet not initialized. Call generate() first.');
    }
    
    const messageBytes = new TextEncoder().encode(message);
    const signature = nacl.sign.detached(messageBytes, this.keyPair.secretKey);
    return encodeBase64(signature);
  }

  /**
   * Verify a signature (using public key)
   */
  static verify(message, signature, publicKey) {
    try {
      const messageBytes = new TextEncoder().encode(message);
      const signatureBytes = decodeBase64(signature);
      const publicKeyBytes = decodeBase64(publicKey);
      
      return nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
    } catch (error) {
      return false;
    }
  }

  /**
   * Destroy the wallet (clear keys from memory)
   * Called after ticket expiration
   */
  destroy() {
    if (this.keyPair) {
      // Clear keys from memory
      this.keyPair = null;
      this.createdAt = null;
    }
  }

  /**
   * Check if wallet is expired (optional time-based expiration)
   */
  isExpired(maxAge = 24 * 60 * 60 * 1000) { // 24 hours default
    if (!this.createdAt) return true;
    return (Date.now() - this.createdAt) > maxAge;
  }
}

