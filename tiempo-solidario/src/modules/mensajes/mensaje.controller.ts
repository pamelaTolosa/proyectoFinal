import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { MensajeService } from './mensaje.service';
import { CreateMensajeDto } from './dto/create-mensaje.dto';

@Controller('mensajes')
export class MensajeController {

  constructor(
    private readonly mensajeService: MensajeService,
  ) {}

  // =========================
  // CREAR MENSAJE
  // =========================

  @Post()
  crearMensaje(
    @Body() body: CreateMensajeDto,
  ) {
    return this.mensajeService.crearMensaje(body);
  }

  // =========================
  // OBTENER MENSAJES
  // =========================

  @Get(':id')
  obtenerMensajesUsuario(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.mensajeService.obtenerMensajesUsuario(id);
  }
}