import { Module } from '@nestjs/common';
import { CryptoModule } from '../crypto/crypto.module';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';

@Module({
  imports: [CryptoModule],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
