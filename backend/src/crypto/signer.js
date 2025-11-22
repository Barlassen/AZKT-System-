/**
 * SBB Ticket Signer
 * Signs tickets with SBB's private key
 */

import nacl from 'tweetnacl';
import pkg from 'tweetnacl-util';
const { encodeBase64, decodeBase64 } = pkg;
import crypto from 'node:crypto';

export class SBBSigner {
  constructor() {
    // In production, load from secure environment variable
    // For hackathon, generate a key pair
    this.keyPair = this.loadOrGenerateKeyPair();
  }

  /**
   * Load key pair from env or generate new one
   */
  loadOrGenerateKeyPair() {
    const privateKeyEnv = process.env.SBB_PRIVATE_KEY;
    const publicKeyEnv = process.env.SBB_PUBLIC_KEY;

    if (privateKeyEnv && publicKeyEnv) {
      return {
        publicKey: decodeBase64(publicKeyEnv),
        secretKey: decodeBase64(privateKeyEnv)
      };
    }

    // Generate new key pair for development
    const keyPair = nacl.sign.keyPair();
    console.warn('⚠️  Generated new SBB key pair. Set SBB_PRIVATE_KEY and SBB_PUBLIC_KEY env vars for production.');
    return keyPair;
  }

  /**
   * Get SBB public key (for verification)
   */
  getPublicKey() {
    return encodeBase64(this.keyPair.publicKey);
  }

  /**
   * Sign a ticket
   */
  signTicket(ticketData) {
    const ticketString = JSON.stringify(ticketData);
    const ticketBytes = new TextEncoder().encode(ticketString);
    const signature = nacl.sign.detached(ticketBytes, this.keyPair.secretKey);
    
    return encodeBase64(signature);
  }

  /**
   * Verify a ticket signature
   */
  verifyTicket(ticketData, signature) {
    try {
      const ticketString = JSON.stringify(ticketData);
      const ticketBytes = new TextEncoder().encode(ticketString);
      const signatureBytes = decodeBase64(signature);
      
      return nacl.sign.detached.verify(
        ticketBytes,
        signatureBytes,
        this.keyPair.publicKey
      );
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate a unique ticket ID
   */
  generateTicketId() {
    return crypto.randomBytes(16).toString('hex');
  }
}

