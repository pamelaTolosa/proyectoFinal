import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../src/modules/usuario/usuario.service';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async signIn(
  correo: string,
  contrasenia: string,
) {
  const user =
    await this.usuarioService.findByCorreo(correo);

  if (!user || user.contrasenia !== contrasenia) {
    throw new UnauthorizedException();
  }

  const payload = {
    sub: user.id,
    username: user.nombre,
  };

  const access_token =
    await this.jwtService.signAsync(payload);

  return {
    access_token,
    usuario: {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.correo,
    },
  };
}
}