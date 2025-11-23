import { Body, Controller, Post } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { IssueTicketDto } from './dto/issue-ticket.dto';
import { CheckTicketDto } from './dto/check-ticket.dto';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post('issue')
  async issue(@Body() dto: IssueTicketDto) {
    return this.ticketService.issueTicket(dto);
  }

  @Post('check')
  async check(@Body() dto: CheckTicketDto) {
    return this.ticketService.checkTicket(dto);
  }
}
