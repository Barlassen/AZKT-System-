import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as circomlibjs from 'circomlibjs';

@Injectable()
export class CryptoService implements OnModuleInit {
  private eddsa: any;
  private babyJub: any;
  private poseidon: any;
  private F: any;

  private skTA: Uint8Array;
  private pkTA: [bigint, bigint];

  constructor(private readonly config: ConfigService) { }

  async onModuleInit() {
    // Build primitives
    this.eddsa = await circomlibjs.buildEddsa();
    this.poseidon = await circomlibjs.buildPoseidon();

    // babyjub lives INSIDE eddsa
    this.babyJub = this.eddsa.babyJub;
    this.F = this.babyJub.F;

    // load private key
    const skHex = this.config.get<string>('TA_PRIVATE_KEY');
    if (!skHex) throw new Error('TA_PRIVATE_KEY missing');

    // Must be 32 bytes (64 hex chars)
    if (skHex.length !== 64) {
      throw new Error(
        `TA_PRIVATE_KEY must be 32 bytes (64 hex chars), got length=${skHex.length}`,
      );
    }

    this.skTA = Uint8Array.from(Buffer.from(skHex, 'hex'));

    // derive pubkey
    const [Ax, Ay] = this.eddsa.prv2pub(this.skTA);

    // convert to bigint
    this.pkTA = [
      this.F.toObject(Ax) as bigint,
      this.F.toObject(Ay) as bigint,
    ];
  }

  getPublicKey(): [bigint, bigint] {
    return this.pkTA;
  }

  /**
   * msgFields MUST match Noir:
   * hash_7([
   *   md.origin,
   *   md.destination,
   *   md.date,
   *   md.class,
   *   md.product_type,
   *   ticket_id,
   *   C,
   * ])
   */
  signTicketMessage(msgFields: bigint[]) {
    console.log('Signing ticket message:', msgFields);

    // 1) Normalize to field elements (BN254 / BabyJub field)
    const inputs = msgFields.map((x) => this.F.e(x));

    // 2) Poseidon hash over all fields (equivalent to Noir hash_7)
    const msgHash = this.poseidon(inputs);

    // 3) Sign Poseidon hash with EDDSA-Poseidon
    const sig = this.eddsa.signPoseidon(this.skTA, msgHash);

    // 4) R8 is ALREADY an affine point [x, y] – don't multiply again
    const [R_x_raw, R_y_raw] = sig.R8;

    return {
      R_x: this.F.toObject(R_x_raw) as bigint,
      R_y: this.F.toObject(R_y_raw) as bigint,
      s: sig.S as bigint, // EdDSA scalar (NOT the commitment secret)
    };
  }
}
