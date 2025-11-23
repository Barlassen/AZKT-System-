import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as circomlibjs from 'circomlibjs';

@Injectable()
export class CryptoService implements OnModuleInit {
  private eddsa: any;
  private poseidon: any;
  private babyjub: any;
  private skTA: Uint8Array;
  private pkTA: [bigint, bigint];

  constructor(private readonly config: ConfigService) {
  }

  async onModuleInit() {
    this.eddsa = await (circomlibjs as any).buildEddsa();
    this.poseidon = await (circomlibjs as any).buildPoseidon();
    this.babyjub = await (circomlibjs as any).buildBabyjub();

    const skHex = this.config.get<string>("TA_PRIVATE_KEY")!;
    if (!skHex) throw new Error('TA_PRIVATE_KEY missing');

    this.skTA = Uint8Array.from(Buffer.from(skHex, "hex"));

    this.pkTA = this.eddsa.prv2pub(this.skTA);
  }

  getPublicKey(): [bigint, bigint] {
    return this.pkTA;
  }

  signTicketMessage(msgFields: bigint[]) {
    const sig = this.eddsa.signPoseidon(this.skTA, msgFields);

    const R = this.babyjub.affine(sig.R8);
    const [R_x, R_y] = R;
    const s = sig.S as bigint;

    return { R_x, R_y, s };
  }
}
