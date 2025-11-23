import { IsString, IsNotEmpty } from 'class-validator';

export class TicketMetadataPublicDto {
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
}
