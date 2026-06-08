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
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usuarioService.findByUsername(username);
    if (!user || user.contrasenia !== pass) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      username: user.nombre,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}