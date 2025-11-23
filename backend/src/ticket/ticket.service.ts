import { Injectable } from '@nestjs/common';
import { CryptoService } from '../crypto/crypto.service';
import { IssueTicketDto } from './dto/issue-ticket.dto';
import { stationToField, dateToField, ClassMap, ProductTypeMap } from './types';

@Injectable()
export class TicketService {
  constructor(private readonly crypto: CryptoService) { }

  async issueTicket(dto: IssueTicketDto) {
    const { md, ticket_id, C } = dto;

    const originF = stationToField(md.origin);
    const destinationF = stationToField(md.destination);
    const dateF = dateToField(md.date);
    const classF = BigInt(ClassMap[md.class]);
    const productTypeF = BigInt(ProductTypeMap[md.product_type]);

    const ticketIdF = BigInt(ticket_id);
    const CF = BigInt(C);

    const msgFields: bigint[] = [
      originF,
      destinationF,
      dateF,
      classF,
      productTypeF,
      ticketIdF,
      CF,
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
        s: s.toString(), // EdDSA scalar
      },
    };
  }
}
