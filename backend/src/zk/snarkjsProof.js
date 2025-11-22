/**
 * Real ZK Proof Generator using snarkjs
 * Generates actual zero-knowledge proofs from Circom circuit
 * 
 * Requirements:
 * - Compiled circuit (.wasm, .r1cs)
 * - zkey file
 * - snarkjs package
 */

import { readFileSync, writeFileSync as fsWriteFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths to compiled circuit files
const CIRCUIT_WASM = join(__dirname, '../../../contracts/build/TicketOwnership_js/TicketOwnership.wasm');
const CIRCUIT_ZKEY = join(__dirname, '../../../contracts/build/TicketOwnership_0001.zkey');

/**
 * Generate ZK proof using snarkjs
 * 
 * @param {Object} inputs - Circuit inputs
 * @param {string} inputs.privateKey - Private key (secret)
 * @param {Array} inputs.ticketCommitmentPath - Merkle proof path
 * @param {string} inputs.merkleRoot - Merkle root (public)
 * @param {string} inputs.ticketID - Ticket ID (public)
 * 
 * @returns {Promise<Object>} ZK proof with public signals
 */
export async function generateZKProof(inputs) {
  try {
    // Check if circuit files exist
    if (!fileExists(CIRCUIT_WASM) || !fileExists(CIRCUIT_ZKEY)) {
      throw new Error('Circuit files not found. Please compile circuit first.');
    }

    // Prepare input file for witness generation
    // Hydra-S3 style: pathElements and pathIndices
    const inputData = {
      privateKey: inputs.privateKey,
      ticketCommitmentPathElements: inputs.ticketCommitmentPath?.pathElements || formatMerkleProofLegacy(inputs.ticketCommitmentPath),
      ticketCommitmentPathIndices: inputs.ticketCommitmentPath?.pathIndices || formatMerkleProofIndices(inputs.ticketCommitmentPath),
      merkleRoot: inputs.merkleRoot,
      ticketID: inputs.ticketID
    };

    const inputPath = join(__dirname, '../../../contracts/build/input.json');
    const witnessPath = join(__dirname, '../../../contracts/build/witness.wtns');
    const proofPath = join(__dirname, '../../../contracts/build/proof.json');
    const publicPath = join(__dirname, '../../../contracts/build/public.json');

    // Write input file
    fsWriteFileSync(inputPath, JSON.stringify(inputData, null, 2));

    // Generate witness
    console.log('Generating witness...');
    execSync(
      `node ${CIRCUIT_WASM.replace('TicketOwnership.wasm', 'generate_witness.js')} ` +
      `${CIRCUIT_WASM} ${inputPath} ${witnessPath}`,
      { stdio: 'inherit', cwd: join(__dirname, '../../../contracts') }
    );

    // Generate proof
    console.log('Generating ZK proof...');
    execSync(
      `snarkjs groth16 prove ${CIRCUIT_ZKEY} ${witnessPath} ${proofPath} ${publicPath}`,
      { stdio: 'inherit', cwd: join(__dirname, '../../../contracts') }
    );

    // Read proof and public signals
    const proof = JSON.parse(readFileSync(proofPath));
    const publicSignals = JSON.parse(readFileSync(publicPath));

    return {
      proof,
      publicSignals
    };

  } catch (error) {
    console.error('ZK Proof generation failed:', error);
    throw new Error(`Failed to generate ZK proof: ${error.message}`);
  }
}

/**
 * Format Merkle proof for circuit input (Hydra-S3 style)
 */
function formatMerkleProofLegacy(merkleProof) {
  // Legacy format: array of {hash, isRight}
  if (Array.isArray(merkleProof)) {
    return merkleProof.map(node => node.hash || '0');
  }
  return [];
}

function formatMerkleProofIndices(merkleProof) {
  // Legacy format: array of {hash, isRight}
  if (Array.isArray(merkleProof)) {
    return merkleProof.map(node => node.isRight ? 1 : 0);
  }
  return [];
}

/**
 * Check if file exists
 */
function fileExists(path) {
  return existsSync(path);
}

