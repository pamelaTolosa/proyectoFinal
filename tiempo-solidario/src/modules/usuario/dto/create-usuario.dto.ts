import { IsOptional, IsString } from 'class-validator';

export class CreateUsuarioDto {

  @IsString()
  nombre!: string;

  @IsString()
  apellido!: string;

  @IsString()
  dni!: string;

  @IsString()
  correo!: string;

  @IsString()
  contrasenia!: string;

  @IsOptional() // ✅ Hacer opcional
  @IsString()
  fecha_de_nacimiento?: string;

  @IsString()
  acercaDeMi!: string;

  @IsString()
  foto!: string;

}