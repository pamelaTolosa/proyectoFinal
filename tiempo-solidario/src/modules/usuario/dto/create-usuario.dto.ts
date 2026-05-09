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


  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  apellido!: string;

  @IsOptional()
  @IsString()
  foto?: string;

  @IsDateString()
  @IsNotEmpty()
  fecha_de_nacimiento!: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  correo!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(400)
  acercaDeMi!: string;


  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  contrasenia!: string;

}