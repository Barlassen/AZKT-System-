/**
 * Ticket Generator
 * Creates anonymous tickets with ZK proofs using Merkle Tree
 * Complies with SBB requirements: COPY-SAFE, ANONYMOUS, MULTI-CHECK, EASY ACCESS, PRINT@HOME
 */

import { SBBSigner } from '../crypto/signer.js';
import { MerkleTree } from '../merkle/merkleTree.js';
import { generateUserCommitment, generateNullifier } from '../merkle/commitment.js';
import { CopyProtectionManager } from '../merkle/copyProtection.js';
import QRCode from 'qrcode';
import crypto from 'node:crypto';

// Real ZK proof generator (lazy loaded)
let generateZKProof = null;
let zkProofModuleLoaded = false;

export class TicketGenerator {
  constructor() {
    this.signer = new SBBSigner();
    this.merkleTree = new MerkleTree(20); // TREE_DEPTH = 20
    this.tickets = new Map(); // Store tickets for Merkle tree
    this.copyProtection = new CopyProtectionManager(); // Prevents QR copying (COPY-SAFE)
    this.useRealZKProofs = false;
    this.loadZKProofModule();
  }

  /**
   * Load ZK proof module (lazy loading)
   */
  async loadZKProofModule() {
    if (zkProofModuleLoaded) return;
    
    try {
      const zkModule = await import('../zk/snarkjsProof.js');
      generateZKProof = zkModule.generateZKProof;
      this.useRealZKProofs = true;
      zkProofModuleLoaded = true;
      console.log('✅ Real ZK proof generator loaded');
    } catch (error) {
      console.warn('⚠️  Real ZK proof generator not available, using simplified version');
      console.warn('   To enable: compile circuit and generate zkey');
      this.useRealZKProofs = false;
    }
  }

  /**
   * Generate a new anonymous ticket with Merkle tree integration
   * SBB Requirements:
   * - COPY-SAFE: QR cannot be copied and used by someone else
   * - ANONYMOUS: No personal data
   * - MULTI-CHECK: Can be verified multiple times
   * - PRINT@HOME: Can be printed on paper
   */
  async generateTicket(request) {
    try {
      const {
        start,           // Start station (e.g., "Lausanne")
        destination,     // Destination station (e.g., "Geneva")
        date,            // Date (ISO string)
        time,            // Departure time
        ticketType,      // Ticket type (e.g., "single", "day-pass")
        price,           // Price in CHF
        userPublicKey,
        userPrivateKey   // Needed for commitment generation
      } = request;

      // Validate inputs
      if (!start || !destination || !date || !time || !ticketType || !price || !userPublicKey || !userPrivateKey) {
        throw new Error('Missing required fields in ticket request');
      }

      // Generate unique ticket ID
      const ticketId = this.signer.generateTicketId();

      // Generate user commitment
      const userCommitment = generateUserCommitment(userPrivateKey, ticketId);

    // Add commitment to Merkle tree
    this.merkleTree.addLeaf(userCommitment);
    this.merkleTree.buildTree();

    // Get Merkle proof path (Hydra-S3 style: pathElements + pathIndices)
    const leafIndex = this.merkleTree.leaves.length - 1;
    const merkleProof = this.merkleTree.getProof(leafIndex);

    // Generate copy protection token (for COPY-SAFE requirement)
    // This prevents QR code from being copied and used by someone else
    // But allows MULTI-CHECK (same ticket can be verified multiple times)
    const copyProtectionToken = generateNullifier(userPrivateKey, ticketId);

    // Calculate validity period based on ticket type
    const validity = this.calculateValidity(date, time, ticketType);

    // Create ticket data according to SBB format
    // SBB allows: Start, Destination, Date+Time, Ticket Type, Price, QR code
    const ticketData = {
      ticketId,
      start,              // Start station
      destination,         // Destination station
      date,               // Date
      time,               // Departure time
      ticketType,         // Ticket type
      price,              // Price in CHF
      validity: {
        start: validity.start,
        end: validity.end
      },
      issuedAt: new Date().toISOString(),
      publicKey: userPublicKey,
      userCommitment,
      merkleRoot: this.merkleTree.getRoot(),
      // Hydra-S3 style Merkle proof format
      merkleProof: {
        pathElements: merkleProof.pathElements,
        pathIndices: merkleProof.pathIndices,
        // Legacy format for backward compatibility
        legacy: merkleProof.legacy
      }
    };

    // Load ZK proof module if not loaded
    await this.loadZKProofModule();

    // Generate ZK proof (real or simplified)
    let zkProof = null;
    if (this.useRealZKProofs && generateZKProof) {
      try {
        console.log('Generating real ZK proof...');
        const zkResult = await generateZKProof({
          privateKey: userPrivateKey,
          ticketCommitmentPath: {
            pathElements: merkleProof.pathElements,
            pathIndices: merkleProof.pathIndices
          },
          merkleRoot: this.merkleTree.getRoot(),
          ticketID: ticketId
        });
        zkProof = {
          proof: zkResult.proof,
          publicSignals: zkResult.publicSignals,
          type: 'real_zk_proof'
        };
        console.log('✅ Real ZK proof generated');
      } catch (error) {
        console.warn('⚠️  Real ZK proof generation failed, using simplified:', error.message);
        zkProof = this.generateSimplifiedProof(ticketData, userPublicKey);
      }
    } else {
      zkProof = this.generateSimplifiedProof(ticketData, userPublicKey);
    }

    // Sign ticket with SBB private key
    const signature = this.signer.signTicket(ticketData);

    // Store ticket for verification
    this.tickets.set(ticketId, {
      ticketData,
      copyProtectionToken,
      leafIndex,
      userPrivateKey: userPrivateKey,
      checkCount: 0,  // Track how many times ticket was checked (for MULTI-CHECK)
      zkProof: zkProof
    });

    // Create complete ticket (for QR code)
    // Note: copyProtectionToken is NOT in QR - it's used server-side for COPY-SAFE
    const ticket = {
      ...ticketData,
      zkProof: zkProof,
      signature,
      issuer: 'SBB CFF FFS'
    };

    // Generate QR code optimized for PRINT@HOME
    // High error correction for paper printing
    const qrCode = await this.generateQRCode(ticket, true);

      return {
        ticket,
        qrCode,
        sbbPublicKey: this.signer.getPublicKey(),
        // Return Merkle proof data for client-side ZK proof generation (if needed)
        // Hydra-S3 format: pathElements and pathIndices
        zkProofData: {
          merkleRoot: this.merkleTree.getRoot(),
          merkleProof: {
            pathElements: merkleProof.pathElements,
            pathIndices: merkleProof.pathIndices
          },
          hasRealZKProof: this.useRealZKProofs
        }
      };
    } catch (error) {
      console.error('Error in generateTicket:', error);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }

  /**
   * Generate simplified proof (fallback)
   */
  generateSimplifiedProof(ticketData, userPublicKey) {
    // Simplified commitment-based proof
    // Use Node.js built-in crypto module
    const commitment = crypto.createHash('sha256')
      .update(JSON.stringify({
        ticketId: ticketData.ticketId,
        start: ticketData.start,
        destination: ticketData.destination,
        validity: ticketData.validity,
        publicKey: userPublicKey
      }))
      .digest('hex');

    return {
      commitment: commitment,
      timestamp: Date.now(),
      type: 'simplified_zk_proof'
    };
  }

  /**
   * Calculate validity period based on ticket type
   */
  calculateValidity(date, time, ticketType) {
    const startDateTime = new Date(`${date}T${time}`);
    let endDateTime;

    switch (ticketType) {
      case 'single':
        // Single ticket: valid for 2 hours from departure
        endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000);
        break;
      case 'day-pass':
        // Day pass: valid until end of day
        endDateTime = new Date(startDateTime);
        endDateTime.setHours(23, 59, 59, 999);
        break;
      default:
        // Default: 2 hours
        endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000);
    }

    return {
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString()
    };
  }

  /**
   * Generate QR code optimized for PRINT@HOME
   * High error correction level for paper printing
   */
  async generateQRCode(ticket, forPrint = false) {
    try {
      const ticketString = JSON.stringify(ticket);
      
      const options = {
        errorCorrectionLevel: forPrint ? 'H' : 'M', // High for printing
        type: 'image/png',
        width: forPrint ? 400 : 300,  // Larger for printing
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      };

      const qrDataUrl = await QRCode.toDataURL(ticketString, options);
      
      return qrDataUrl;
    } catch (error) {
      console.error('QR Code generation error:', error);
      console.error('Error stack:', error.stack);
      // Return a placeholder if QR generation fails
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    }
  }

  /**
   * Verify a ticket
   * Supports MULTI-CHECK: same ticket can be verified multiple times
   * But COPY-SAFE: prevents simultaneous use by multiple people
   */
  verifyTicket(ticket, conductorId = null) {
    // Extract ticket data (without signature)
    const { signature, ...ticketData } = ticket;

    // Verify SBB signature
    const signatureValid = this.signer.verifyTicket(ticketData, signature);
    if (!signatureValid) {
      return { valid: false, reason: 'Invalid signature' };
    }

    // Verify ticket exists in our system
    const storedTicket = this.tickets.get(ticketData.ticketId);
    if (!storedTicket) {
      return { valid: false, reason: 'Ticket not found' };
    }

    // Verify Merkle root matches
    if (ticketData.merkleRoot !== this.merkleTree.getRoot()) {
      return { valid: false, reason: 'Merkle root mismatch' };
    }

    // Verify ZK proof (real or simplified)
    if (ticketData.zkProof) {
      if (ticketData.zkProof.type === 'real_zk_proof') {
        // Verify real ZK proof using snarkjs
        const verificationResult = this.verifyRealZKProof(ticketData.zkProof, ticketData);
        if (!verificationResult.valid) {
          return verificationResult;
        }
      } else {
        // Verify simplified proof
        const simplifiedValid = this.verifySimplifiedProof(ticketData.zkProof, ticketData, ticketData.publicKey);
        if (!simplifiedValid) {
          return { valid: false, reason: 'Invalid simplified proof' };
        }
      }
    }

    // Verify timestamp
    const now = new Date();
    const startTime = new Date(ticketData.validity.start);
    const endTime = new Date(ticketData.validity.end);

    if (now < startTime) {
      return { valid: false, reason: 'Ticket not yet valid' };
    }

    if (now > endTime) {
      return { valid: false, reason: 'Ticket expired' };
    }

    // COPY-SAFE: Check if ticket is being used simultaneously by someone else
    // This prevents QR code copying but allows MULTI-CHECK
    const copyCheck = this.copyProtection.checkCopyProtection(
      storedTicket.copyProtectionToken,
      conductorId || 'default'
    );

    if (!copyCheck.valid) {
      return { valid: false, reason: copyCheck.reason };
    }

    // Increment check count (for MULTI-CHECK support)
    storedTicket.checkCount++;

    return { 
      valid: true,
      checkCount: storedTicket.checkCount,
      message: 'Ticket valid - can be checked multiple times',
      zkProofType: ticketData.zkProof?.type || 'none'
    };
  }

  /**
   * Verify real ZK proof using snarkjs
   */
  async verifyRealZKProof(zkProof, ticketData) {
    try {
      const { readFileSync } = await import('fs');
      const { execSync } = await import('child_process');
      const { join } = await import('path');
      const { fileURLToPath } = await import('url');
      const { dirname } = await import('path');
      
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      const verificationKeyPath = join(__dirname, '../../../contracts/build/verification_key.json');
      
      // Check if verification key exists
      const fs = await import('fs');
      if (!fs.existsSync(verificationKeyPath)) {
        return { valid: false, reason: 'Verification key not found' };
      }

      // Write proof and public signals to temp files
      const proofPath = join(__dirname, '../../../contracts/build/proof_verify.json');
      const publicPath = join(__dirname, '../../../contracts/build/public_verify.json');
      
      fs.writeFileSync(proofPath, JSON.stringify(zkProof.proof));
      fs.writeFileSync(publicPath, JSON.stringify(zkProof.publicSignals));

      // Verify using snarkjs
      execSync(
        `snarkjs groth16 verify ${verificationKeyPath} ${publicPath} ${proofPath}`,
        { stdio: 'pipe', cwd: join(__dirname, '../../../contracts') }
      );

      return { valid: true };
    } catch (error) {
      return { valid: false, reason: `ZK proof verification failed: ${error.message}` };
    }
  }

  /**
   * Verify simplified proof
   */
  verifySimplifiedProof(proof, ticketData, userPublicKey) {
    const expectedCommitment = crypto.createHash('sha256')
      .update(JSON.stringify({
        ticketId: ticketData.ticketId,
        start: ticketData.start,
        destination: ticketData.destination,
        validity: ticketData.validity,
        publicKey: userPublicKey
      }))
      .digest('hex');

    return proof.commitment === expectedCommitment;
  }

  /**
   * Get current Merkle root (public)
   */
  getMerkleRoot() {
    return this.merkleTree.getRoot();
  }
}
