import { IsInt, IsDateString, Min, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRegistroHorasDto {

  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  horas: number;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  emisor_id: number;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  receptor_id: number;
}