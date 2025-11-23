import { Controller, Get } from '@nestjs/common';
import { ItinaryService} from './itinary.service';

@Controller('itinaries')
export class ItinaryController {
  constructor(private readonly itinaryService: ItinaryService) {}

  @Get()
  getItinaries() {
    return this.itinaryService.getItinaries();
  }
}
