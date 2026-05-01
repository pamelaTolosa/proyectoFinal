import {
  IsString,
  IsEmail,
  IsDateString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsInt,
  Min,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUsuarioDto {

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  dni: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  apellido: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  @MaxLength(255)
  foto?: string;

  @IsDateString()
  @IsNotEmpty()
  fecha_de_nacimiento: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  correo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(400)
  acerca_de_mi: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  contrasenia: string;

}