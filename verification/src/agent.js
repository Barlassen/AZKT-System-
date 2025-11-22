/**
 * AZKT Verification Agent
 * Offline-capable ticket verification for conductors
 */

import express from 'express';
import QRCode from 'qrcode';
import nacl from 'tweetnacl';
import pkg from 'tweetnacl-util';
const { decodeBase64 } = pkg;
import { ZKProofVerifier } from './zk/verifier.js';
import { MerkleTree } from './merkle/merkleTree.js';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(express.static('public'));

// Pre-loaded SBB public key (in production, loaded securely)
let SBB_PUBLIC_KEY = null;

/**
 * Load SBB public key
 * In production, this would be loaded from secure storage
 */
function loadSBBPublicKey() {
  // For demo, this would come from environment or secure config
  const publicKeyEnv = process.env.SBB_PUBLIC_KEY;
  if (publicKeyEnv) {
    SBB_PUBLIC_KEY = decodeBase64(publicKeyEnv);
    return true;
  }
  console.warn('⚠️  SBB public key not loaded. Set SBB_PUBLIC_KEY env var.');
  return false;
}

/**
 * Verify ticket signature
 */
function verifySignature(ticketData, signature) {
  if (!SBB_PUBLIC_KEY) {
    return { valid: false, reason: 'SBB public key not loaded' };
  }

  try {
    const ticketString = JSON.stringify(ticketData);
    const ticketBytes = new TextEncoder().encode(ticketString);
    const signatureBytes = decodeBase64(signature);
    
    const isValid = nacl.sign.detached.verify(
      ticketBytes,
      signatureBytes,
      SBB_PUBLIC_KEY
    );

    return { valid: isValid };
  } catch (error) {
    return { valid: false, reason: 'Signature verification failed' };
  }
}

/**
 * Verify ticket timestamp
 */
function verifyTimestamp(validity) {
  const now = new Date();
  const startTime = new Date(validity.start);
  const endTime = new Date(validity.end);

  if (now < startTime) {
    return { valid: false, reason: 'Ticket not yet valid' };
  }

  if (now > endTime) {
    return { valid: false, reason: 'Ticket expired' };
  }

  return { valid: true };
}

/**
 * Main verification function
 */
function verifyTicket(ticket) {
  const results = {
    signature: null,
    zkProof: null,
    timestamp: null,
    overall: false
  };

  // Extract ticket data
  const { signature, zkProof, ...ticketData } = ticket;

  // 1. Verify SBB signature
  results.signature = verifySignature(ticketData, signature);
  if (!results.signature.valid) {
    return { ...results, overall: false, reason: results.signature.reason };
  }

  // 2. Verify ZK proof (with Merkle tree support)
  results.zkProof = ZKProofVerifier.verifyProof(
    zkProof || ticketData.zkProof,
    ticketData,
    ticketData.publicKey
  );
  if (!results.zkProof.valid) {
    return { ...results, overall: false, reason: results.zkProof.reason || 'Invalid ZK proof' };
  }

  // 2.5. Verify Merkle proof if available (supports Hydra-S3 format)
  if (ticketData.merkleProof && ticketData.merkleRoot) {
    // Handle both Hydra-S3 format and legacy format
    const merkleProof = ticketData.merkleProof.pathElements 
      ? ticketData.merkleProof  // Hydra-S3 format
      : ticketData.merkleProof.legacy || ticketData.merkleProof; // Legacy format
    
    const merkleValid = ZKProofVerifier.verifyMerkleProof(
      ticketData.userCommitment,
      merkleProof,
      ticketData.merkleRoot
    );
    if (!merkleValid) {
      return { ...results, overall: false, reason: 'Merkle proof invalid' };
    }
  }

  // 3. Verify timestamp
  results.timestamp = verifyTimestamp(ticketData.validity);
  if (!results.timestamp.valid) {
    return { ...results, overall: false, reason: results.timestamp.reason };
  }

  // All checks passed
  return {
    ...results,
    overall: true,
    ticketId: ticketData.ticketId,
    route: ticketData.route
  };
}

// API Routes

/**
 * Health check
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AZKT Verification Agent',
    sbbKeyLoaded: SBB_PUBLIC_KEY !== null
  });
});

/**
 * Verify ticket from QR code data
 * POST /api/verify
 */
app.post('/api/verify', (req, res) => {
  try {
    const { ticket } = req.body;

    if (!ticket) {
      return res.status(400).json({ error: 'Ticket data required' });
    }

    const result = verifyTicket(ticket);

    res.json({
      valid: result.overall,
      ticketId: result.ticketId,
      route: result.route,
      checks: {
        signature: result.signature.valid,
        zkProof: result.zkProof.valid,
        timestamp: result.timestamp.valid
      },
      reason: result.reason || null
    });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      error: 'Verification failed',
      message: error.message
    });
  }
});

/**
 * Decode QR code string
 * POST /api/decode-qr
 */
app.post('/api/decode-qr', (req, res) => {
  try {
    const { qrString } = req.body;

    if (!qrString) {
      return res.status(400).json({ error: 'QR string required' });
    }

    // Parse QR code data (JSON string)
    const ticket = JSON.parse(qrString);
    
    // Verify ticket
    const result = verifyTicket(ticket);

    res.json({
      ticket,
      verification: {
        valid: result.overall,
        checks: {
          signature: result.signature.valid,
          zkProof: result.zkProof.valid,
          timestamp: result.timestamp.valid
        },
        reason: result.reason || null
      }
    });

  } catch (error) {
    console.error('QR decode error:', error);
    res.status(500).json({
      error: 'Failed to decode QR code',
      message: error.message
    });
  }
});

// Initialize
loadSBBPublicKey();

// Start server
app.listen(PORT, () => {
  console.log(`✅ AZKT Verification Agent running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🔑 SBB Public Key: ${SBB_PUBLIC_KEY ? 'Loaded' : 'Not loaded'}`);
});

