import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';

import { RegistroHorasService } from './registro-horas.service';
import { CreateRegistroHorasDto } from './dto/create-registro-horas.dto';

@Controller('registro-horas')
export class RegistroHorasController {

  constructor(
    private readonly registroHorasService: RegistroHorasService,
  ) {}

  // =========================
  // CREAR
  // =========================

  @Post()
  create(
    @Body()
    dto: CreateRegistroHorasDto,
  ) {
    return this.registroHorasService.createRegistro(dto);
  }

  // =========================
  // TODOS
  // =========================

  @Get()
  findAll() {
    return this.registroHorasService.findAll();
  }

  // =========================
  // POR USUARIO
  // =========================

  @Get(':id')
  findByUsuario(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.registroHorasService.findByUsuario(id);
  }
}