import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class TicketMetadataDto {
  @IsString()
  @IsNotEmpty()
  origin: string;

  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  class: string;

  @IsString()
  @IsNotEmpty()
  product_type: string;

  @IsString()
  @IsNotEmpty()
  ticket_id: string;
}

export class IssueTicketDto {
  md: TicketMetadataDto;

  @IsString()
  @IsNotEmpty()
  C: string;
}
