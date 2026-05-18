import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  ParseIntPipe,
  Put,
} from '@nestjs/common';

import { NotificacionService } from './notificacion.service';
import { CreateNotificacionDto } from './dto/notificaciones.dto';

@Controller('notificaciones')
export class NotificacionController {

  constructor(
    private readonly service: NotificacionService,
  ) {}

  // =========================
  // CREAR
  // =========================

@Post()
create(
  @Body()
  body: CreateNotificacionDto,
) {
  return this.service.create(body);
}
  

  // =========================
  // POR USUARIO
  // =========================

  @Get('usuario/:id')
  findByUsuario(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.service.findByUsuario(id);
  }

  // =========================
  // APROBAR
  // =========================

  @Put('aprobar/:id')
  aprobar(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.service.aprobar(id);
  }

  // =========================
  // MARCAR LEÍDAS
  // =========================

  @Put('leidas/:id')
  leidas(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.service.marcarLeidas(id);
  }
}