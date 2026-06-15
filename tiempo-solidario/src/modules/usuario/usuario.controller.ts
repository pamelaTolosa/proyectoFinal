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
import { Public } from '../../../auth/metadata';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get()
findAll() {
  return this.usuarioService.getService();
}

  // =========================
  // LOGIN
  // =========================
  @Post('login')
  login(
    @Body()
    body: {
      correo: string;
      contrasenia: string;
    },
  ) {
    return this.usuarioService.login(body.correo, body.contrasenia);
  }

  // =========================
  // CREATE USER
  // =========================
  @Public()
  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.postService(createUsuarioDto);
  }

  // =========================
  // FIND BY ID
  // =========================
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuarioService.findOne(id);
  }

  // =========================
  // SALDO
  // =========================
  @Get(':id/saldo')
  getSaldo(@Param('id', ParseIntPipe) id: number) {
    return this.usuarioService.getSaldo(id);
  }

  // =========================
  // DNI
  // =========================
  @Get('dni/:dni')
  findByDni(@Param('dni') dni: string) {
    return this.usuarioService.findByDni(dni);
  }
}