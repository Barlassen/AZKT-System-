/**
 * ZK Proof Generation Script
 * Generates ZK proof for ticket ownership using snarkjs
 * 
 * Usage: node scripts/generateProof.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildDir = path.join(__dirname, '../build');

/**
 * Generate ZK proof for ticket
 * 
 * @param {Object} inputs - Proof inputs
 * @param {string} inputs.privateKey - User's private key (secret)
 * @param {Array} inputs.merkleProof - Merkle proof path
 * @param {string} inputs.merkleRoot - Merkle root (public)
 * @param {string} inputs.ticketID - Ticket ID (public)
 */
export function generateProof(inputs) {
  try {
    // Prepare input file
    const inputData = {
      privateKey: inputs.privateKey,
      ticketCommitmentPath: inputs.merkleProof.map(p => [
        p.hash || '0',
        p.isRight ? '1' : '0'
      ]),
      merkleRoot: inputs.merkleRoot,
      ticketID: inputs.ticketID
    };

    const inputPath = path.join(buildDir, 'input.json');
    writeFileSync(inputPath, JSON.stringify(inputData, null, 2));

    // Generate witness
    console.log('Generating witness...');
    execSync(
      `node ${buildDir}/TicketOwnership_js/generate_witness.js ` +
      `${buildDir}/TicketOwnership_js/TicketOwnership.wasm ` +
      `${inputPath} ${buildDir}/witness.wtns`,
      { stdio: 'inherit' }
    );

    // Generate proof
    console.log('Generating proof...');
    execSync(
      `snarkjs groth16 prove ${buildDir}/TicketOwnership_0001.zkey ` +
      `${buildDir}/witness.wtns ${buildDir}/proof.json ${buildDir}/public.json`,
      { stdio: 'inherit' }
    );

    // Read proof and public signals
    const proof = JSON.parse(readFileSync(path.join(buildDir, 'proof.json')));
    const publicSignals = JSON.parse(readFileSync(path.join(buildDir, 'public.json')));

    return {
      proof,
      publicSignals
    };

  } catch (error) {
    console.error('Proof generation failed:', error);
    throw error;
  }
}

/**
 * Verify ZK proof
 */
export function verifyProof(proof, publicSignals) {
  try {
    const verificationKeyPath = path.join(buildDir, 'verification_key.json');
    
    // Write proof and public signals to files
    writeFileSync(path.join(buildDir, 'proof_verify.json'), JSON.stringify(proof));
    writeFileSync(path.join(buildDir, 'public_verify.json'), JSON.stringify(publicSignals));

    // Verify proof
    execSync(
      `snarkjs groth16 verify ${verificationKeyPath} ` +
      `${buildDir}/public_verify.json ${buildDir}/proof_verify.json`,
      { stdio: 'inherit' }
    );

    return true;
  } catch (error) {
    console.error('Proof verification failed:', error);
    return false;
  }
}

// Example usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const exampleInputs = {
    privateKey: '123456789',
    ticketID: 'ticket-123',
    merkleRoot: '0x1234567890abcdef',
    merkleProof: [
      { hash: '0xabc', isRight: false },
      { hash: '0xdef', isRight: true },
      // ... more proof nodes
    ]
  };

  console.log('Example proof generation...');
  // generateProof(exampleInputs);
}

