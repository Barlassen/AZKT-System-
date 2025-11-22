/**
 * AZKT Backend Server
 * SBB ticket generation API with Merkle Tree support
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { TicketGenerator } from './src/ticket/ticket.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize ticket generator
const ticketGenerator = new TicketGenerator();

// Routes

/**
 * Health check
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'AZKT Backend',
    merkleRoot: ticketGenerator.getMerkleRoot() || 'Tree not initialized'
  });
});

/**
 * Get available routes
 */
app.get('/api/routes', (req, res) => {
  // Mock routes for hackathon (SBB format)
  // In production, this would query a real database
  const routes = [
    { id: 'lausanne-geneva', from: 'Lausanne', to: 'Geneva', duration: 55, price: 15.00 },
    { id: 'zurich-bern', from: 'Zurich', to: 'Bern', duration: 60, price: 18.00 },
    { id: 'basel-zurich', from: 'Basel', to: 'Zurich', duration: 55, price: 16.00 },
    { id: 'geneva-lausanne', from: 'Geneva', to: 'Lausanne', duration: 55, price: 15.00 },
    { id: 'basel-bern', from: 'Basel', to: 'Bern', duration: 75, price: 22.00 },
    { id: 'zurich-lausanne', from: 'Zurich', to: 'Lausanne', duration: 135, price: 32.00 },
    { id: 'bern-geneva', from: 'Bern', to: 'Geneva', duration: 95, price: 25.00 },
    { id: 'lausanne-zurich', from: 'Lausanne', to: 'Zurich', duration: 135, price: 32.00 },
    { id: 'bern-basel', from: 'Bern', to: 'Basel', duration: 75, price: 22.00 },
    { id: 'zurich-basel', from: 'Zurich', to: 'Basel', duration: 55, price: 16.00 },
    { id: 'geneva-zurich', from: 'Geneva', to: 'Zurich', duration: 175, price: 38.00 },
    { id: 'bern-lausanne', from: 'Bern', to: 'Lausanne', duration: 95, price: 25.00 }
  ];
  
  res.json({ routes });
});

/**
 * Request a new ticket
 * POST /api/ticket/request
 * 
 * SBB Format:
 * - start: Start station
 * - destination: Destination station
 * - date: Date (ISO string)
 * - time: Departure time
 * - ticketType: Ticket type (single, day-pass, etc.)
 * - price: Price in CHF
 */
app.post('/api/ticket/request', async (req, res) => {
  try {
    const { 
      start, 
      destination, 
      date, 
      time, 
      ticketType, 
      price,
      userPublicKey, 
      userPrivateKey 
    } = req.body;

    // Validation
    if (!start || !destination || !date || !time || !ticketType || !price || !userPublicKey || !userPrivateKey) {
      return res.status(400).json({
        error: 'Missing required fields: start, destination, date, time, ticketType, price, userPublicKey, userPrivateKey'
      });
    }

    // Generate ticket with Merkle tree (SBB compliant)
    const result = await ticketGenerator.generateTicket({
      start,
      destination,
      date,
      time,
      ticketType,
      price,
      userPublicKey,
      userPrivateKey
    });

    res.json({
      success: true,
      ticket: result.ticket,
      qrCode: result.qrCode,
      sbbPublicKey: result.sbbPublicKey,
      zkProofData: result.zkProofData // Merkle root and proof for client-side ZK proof
    });

  } catch (error) {
    console.error('Error generating ticket:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      error: 'Failed to generate ticket',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * Verify a ticket
 * POST /api/ticket/verify
 */
app.post('/api/ticket/verify', (req, res) => {
  try {
    const { ticket } = req.body;

    if (!ticket) {
      return res.status(400).json({ error: 'Ticket data required' });
    }

    const verification = ticketGenerator.verifyTicket(ticket);

    res.json(verification);

  } catch (error) {
    console.error('Error verifying ticket:', error);
    res.status(500).json({
      error: 'Failed to verify ticket',
      message: error.message
    });
  }
});

/**
 * Get current Merkle root (public)
 * GET /api/merkle-root
 */
app.get('/api/merkle-root', (req, res) => {
  const merkleRoot = ticketGenerator.getMerkleRoot();
  res.json({
    merkleRoot: merkleRoot || null,
    message: merkleRoot ? 'Merkle tree initialized' : 'Merkle tree not initialized'
  });
});

/**
 * Get SBB public key (for verification)
 */
app.get('/api/public-key', (req, res) => {
  // This would normally come from the signer
  // For now, return a note that it should be pre-loaded
  res.json({
    message: 'SBB public key should be pre-loaded in verification agent',
    note: 'In production, this key is distributed securely to all verification devices'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚂 AZKT Backend server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🌳 Merkle Tree: Ready (Depth: 20)`);
});
