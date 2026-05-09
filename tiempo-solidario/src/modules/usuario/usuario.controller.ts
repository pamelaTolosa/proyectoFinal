import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  ParseIntPipe,
  UnauthorizedException,
} from '@nestjs/common';

import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Controller('usuarios')
export class UsuarioController {

  constructor(
    private readonly usuarioService: UsuarioService,
  ) {}

  // 🔥 TODOS LOS USUARIOS
  @Get()
  findAll() {
    return this.usuarioService.getService();
  }

  // 🔥 LOGIN
  @Post('login')
  async login(
    @Body()
    body: {
      correo: string;
      contrasenia: string;
    },
  ) {

    const usuario =
      await this.usuarioService.login(
        body.correo,
        body.contrasenia,
      );

    return usuario;
  }

  // 🔥 CREAR USUARIO
  @Post()
  postController(
    @Body() user: CreateUsuarioDto,
  ) {
    return this.usuarioService.postService(user);
  }

  // 🔥 OBTENER POR ID
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.usuarioService.findOne(id);
  }

  // 🔥 SALDO
  @Get(':id/saldo')
  getSaldo(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.usuarioService.getSaldo(id);
  }
}