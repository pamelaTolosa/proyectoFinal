import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../src/modules/usuario/usuario.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) { }

  async signIn(correo: string, contrasenia: string) {
    const usuario = await this.usuarioService.findByEmail(correo);

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const ok = await bcrypt.compare(contrasenia, usuario.contrasenia);

    if (!ok) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const token = this.jwtService.sign({
      sub: usuario.id,
      correo: usuario.correo,
    });

    return {
      access_token: token,
      usuario,
    };
  }

  async getProfile(userId: number) {
    return this.usuarioService.findById(userId);
  }
}