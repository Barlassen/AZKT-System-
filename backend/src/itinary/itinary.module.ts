import { Module } from '@nestjs/common';
import { CryptoModule } from '../crypto/crypto.module';
import { ItinaryController } from './itinary.controller';
import { ItinaryService } from './itinary.service';

@Module({
  controllers: [ItinaryController],
  providers: [ItinaryService],
})
export class ItinaryModule {}
