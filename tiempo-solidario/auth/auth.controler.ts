import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Public } from './metadata';
import { UsuarioService } from '../src/modules/usuario/usuario.service';  

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usuarioService: UsuarioService
  ) { }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(
      signInDto.correo,
      signInDto.contrasenia,
    );
  }

 @UseGuards(AuthGuard)
@Get('profile')
async getProfile(@Request() req) {
  return this.usuarioService.findOne(req.user.sub);
}

}

