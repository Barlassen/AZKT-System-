// src/ticket/ticket.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IssueTicketDto } from './dto/issue-ticket.dto';
import { CheckTicketDto } from './dto/check-ticket.dto';
import { CryptoService } from '../crypto/crypto.service';

type LogEntry = {
  timestamp: number;
  train_id: string;
  segment: string;
};

@Injectable()
export class TicketService {
  private nullifierLog = new Map<string, LogEntry[]>();

  constructor(
    private readonly config: ConfigService,
    private readonly crypto: CryptoService,
  ) {}

  private checkFraud(N: string, newEntry: LogEntry) {
    const entries = this.nullifierLog.get(N) || [];

    for (const e of entries) {
      const sameTrain = e.train_id === newEntry.train_id;
      const dt = Math.abs(newEntry.timestamp - e.timestamp);
      if (!sameTrain && dt < 20 * 60 * 1000) {
        return { fraud: true, reason: 'parallel_use_different_trains' };
      }
    }

    return { fraud: false };
  }

  async issueTicket(dto: IssueTicketDto) {
    const { md, C } = dto;

    const msgFields: bigint[] = [
      BigInt(md.origin),
      BigInt(md.destination),
      BigInt(md.date),
      BigInt(md.class),
      BigInt(md.product_type),
      BigInt(md.ticket_id),
      BigInt(C),
    ];

    const { R_x, R_y, s } = this.crypto.signTicketMessage(msgFields);
    const [pk_x, pk_y] = this.crypto.getPublicKey();

    return {
      ok: true,
      pk_TA: {
        x: pk_x.toString(),
        y: pk_y.toString(),
      },
      sig: {
        R_x: R_x.toString(),
        R_y: R_y.toString(),
        s: s.toString(),
      },
    };
  }

  async checkTicket(dto: CheckTicketDto) {
    const { proof, publicInputs, train_id, segment, timestamp } = dto;

    const { N } = publicInputs;
    const now = typeof timestamp === 'number' ? timestamp : Date.now();
    const entry: LogEntry = { timestamp: now, train_id, segment };

    const { fraud, reason } = this.checkFraud(N, entry);

    const existing = this.nullifierLog.get(N) || [];
    existing.push(entry);
    this.nullifierLog.set(N, existing);

    return {
      ok: true,
      fraud,
      reason: fraud ? reason : undefined,
    };
  }
}
