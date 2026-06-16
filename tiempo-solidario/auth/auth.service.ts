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
  console.log("LOGIN HIT:", correo);

  const usuario = await this.usuarioService.findByEmail(correo);
  console.log("USER:", usuario);

  if (!usuario) {
    throw new UnauthorizedException('Usuario no encontrado');
  }

  const ok = await bcrypt.compare(contrasenia, usuario.contrasenia);
  console.log("PASSWORD OK:", ok);

  if (!ok) {
    throw new UnauthorizedException('Contraseña incorrecta');
  }

  const token = this.jwtService.sign({
    sub: usuario.id,
    correo: usuario.correo,
  });

  const result = {
    access_token: token,
    usuario,
  };

  console.log("RETURN:", result);

  return result;
}
}