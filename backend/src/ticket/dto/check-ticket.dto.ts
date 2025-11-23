
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { TicketMetadataPublicDto } from './ticket-metadata.dto';

export class PublicInputsDto {
  md: TicketMetadataPublicDto

  @IsString()
  @IsNotEmpty()
  C: string;

  @IsString()
  @IsNotEmpty()
  N: string;

  @IsString()
  @IsNotEmpty()
  pk_TA: string;

  @IsString()
  @IsNotEmpty()
  sig: string;
}

export class CheckTicketDto {
  @IsNotEmpty()
  proof: any;

  publicInputs: PublicInputsDto;

  @IsString()
  @IsNotEmpty()
  train_id: string;

  @IsString()
  @IsNotEmpty()
  segment: string;

  @IsOptional()
  @IsNumber()
  timestamp?: number;
}
