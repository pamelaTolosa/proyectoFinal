import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  ParseIntPipe,
} from '@nestjs/common';

import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Controller('usuarios')
export class UsuarioController {

  constructor(
    private readonly usuarioService: UsuarioService,
  ) {}

  // 🔥 CREAR USUARIO
  @Post()
  postController(
    @Body() user: CreateUsuarioDto,
  ) {
    return this.usuarioService.postService(user);
  }

  // 🔥 OBTENER USUARIO POR ID
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.usuarioService.findOne(id);
  }

  // 🔥 SALDO
  @Get(':id/saldo')
  getSaldo(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.usuarioService.getSaldo(id);
  }
}