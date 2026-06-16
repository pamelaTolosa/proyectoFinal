import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Public } from './metadata';
import { UsuarioService } from '../src/modules/usuario/usuario.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usuarioService: UsuarioService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: Record<string, any>) {
    const { correo, contrasenia } = signInDto;

    if (!correo || !contrasenia) {
      throw new BadRequestException('Correo y contraseña son obligatorios');
    }

    const result = await this.authService.signIn(correo, contrasenia);

    // 🔥 FORZAMOS respuesta JSON consistente (esto evita tu error en React)
    return {
      access_token: result.access_token,
      usuario: result.usuario,
    };
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.usuarioService.findOne(req.user.sub);
  }
}