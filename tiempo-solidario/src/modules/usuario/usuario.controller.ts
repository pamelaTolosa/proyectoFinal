import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  ParseIntPipe,
} from '@nestjs/common';

import { UsuarioService } from './usuario.service';

import {CreateUsuarioDto} from './dto/create-usuario.dto';
import { Public } from '../../../auth/metadata';

@Controller('usuarios')
export class UsuarioController {

  constructor(
    private readonly usuarioService: UsuarioService,
  ) {}

  // =========================
  // TODOS LOS USUARIOS
  // =========================

  @Get()
  findAll() {

    return this.usuarioService.getService();

  }

  // =========================
  // LOGIN
  // =========================

  @Post('login')
  async login(

    @Body()
    body: {
      correo: string;
      contrasenia: string;
    },

  ) {
 console.log('ENTRO A /usuarios/login');
  console.log(body);

    return this.usuarioService.login(
      body.correo,
      body.contrasenia,
    );

  }

  // =========================
  // CREAR USUARIO
  // =========================

 
  // =========================
  // OBTENER USUARIO POR ID
  // =========================

  @Get(':id')
  findOne(

    @Param('id', ParseIntPipe)
    id: number,

  ) {

    return this.usuarioService.findOne(id);

  }

  // =========================
  // OBTENER SALDO
  // =========================

  @Get(':id/saldo')
  getSaldo(

    @Param('id', ParseIntPipe)
    id: number,

  ) {

    return this.usuarioService.getSaldo(id);

  }
  @Public()
  @Post()
create(@Body() createUsuarioDto: CreateUsuarioDto) {
  return this.usuarioService.postService(createUsuarioDto);
}
@Get('dni/:dni')
findByDni(
  @Param('dni')
  dni: string,
) {

  return this.usuarioService.findByDni(dni);
}
}