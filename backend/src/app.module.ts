import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TicketModule } from './ticket';
import { ItinaryModule } from './itinary';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TicketModule,
    ItinaryModule,
  ],
})
export class AppModule {}
