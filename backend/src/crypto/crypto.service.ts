import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as circomlibjs from 'circomlibjs';

@Injectable()
export class CryptoService implements OnModuleInit {
  private eddsa: any;
  private poseidon: any;
  private F: any;
  private skTA: Uint8Array;
  private pkTA: [bigint, bigint];

  constructor(private readonly config: ConfigService) { }

  async onModuleInit() {
    this.eddsa = await circomlibjs.buildEddsa();
    this.poseidon = await circomlibjs.buildPoseidon();
    this.F = this.poseidon.F;

    const skHex = this.config.get<string>('TA_PRIVATE_KEY');
    if (!skHex) throw new Error('TA_PRIVATE_KEY missing');
    this.skTA = Uint8Array.from(Buffer.from(skHex, 'hex'));

    const pub = this.eddsa.prv2pub(this.skTA); // [F1, F1]
    this.pkTA = [
      this.F.toObject(pub[0]),
      this.F.toObject(pub[1]),
    ];
  }

  getPublicKey(): [bigint, bigint] {
    return this.pkTA;
  }

  signTicketMessage(msgFields: bigint[]) {
    console.log(msgFields);
    const h = this.poseidon(msgFields);

    const msg = this.F.toObject(h);

    const sig = this.eddsa.signPoseidon(this.skTA, msg);

    const R_x = this.F.toObject(sig.R8[0]);
    const R_y = this.F.toObject(sig.R8[1]);
    const s = this.F.toObject(sig.S);

    return { R_x, R_y, s };
  }
}
