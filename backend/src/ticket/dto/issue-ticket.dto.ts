import { IsString, IsNotEmpty } from 'class-validator';
import { TicketMetadataPublicDto } from './ticket-metadata.dto';

export class IssueTicketDto {
  md: TicketMetadataPublicDto;

  @IsString()
  @IsNotEmpty()
  ticket_id: string;

  @IsString()
  @IsNotEmpty()
  C: string;
}

