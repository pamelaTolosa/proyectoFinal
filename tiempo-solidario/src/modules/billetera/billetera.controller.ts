import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { BilleteraService } from './billetera.service';

@Controller('/billetera')
export class BilleteraController {

  constructor(
    private readonly billeteraService: BilleteraService,
  ) {}

  // =========================
  // CREAR
  // =========================

  @Post()
  create(@Body() body: any) {

    return this.billeteraService.create(body);
  }

  // =========================
  // TODAS
  // =========================

  @Get()
  findAll() {

    return this.billeteraService.findAll();
  }

  // =========================
  // POR USUARIO
  // =========================

  @Get('/usuario/:id')
  findByUsuario(
    @Param('id', ParseIntPipe)
    id: number,
  ) {

    return this.billeteraService.findByUsuario(
      id,
    );
  }
}