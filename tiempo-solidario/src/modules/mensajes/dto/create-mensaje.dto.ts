import {
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateMensajeDto {

  @IsString()
  @MinLength(1)
  mensaje!: string;

  @IsNumber()
  emisorId!: number;

  @IsNumber()
  receptorId!: number;
}