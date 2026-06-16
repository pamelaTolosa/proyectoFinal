import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../src/modules/usuario/usuario.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(correo: string, contrasenia: string) {
    // 🔥 1. Validación básica
    if (!correo || !contrasenia) {
      throw new UnauthorizedException('Correo y contraseña requeridos');
    }

    // 🔥 2. Buscar usuario
    const usuario = await this.usuarioService.findByEmail(correo);

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // 🔥 3. Validar contraseña
    if (!usuario.contrasenia) {
      throw new UnauthorizedException('Usuario sin contraseña configurada');
    }

    const ok = await bcrypt.compare(contrasenia, usuario.contrasenia);

    if (!ok) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    // 🔥 4. Generar token
    const token = this.jwtService.sign({
      sub: usuario.id,
      correo: usuario.correo,
    });

    // 🔥 5. Respuesta SIEMPRE JSON válida
    return {
      access_token: token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
      },
    };
  }
}