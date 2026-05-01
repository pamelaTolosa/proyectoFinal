import { Controller, Post, Body } from '@nestjs/common';
import { RegistroHorasService } from './registro-horas.service';
import { CreateRegistroHorasDto } from './dto/create-registro-horas.dto';

@Controller('/registro-horas')
export class RegistroHorasController {

  constructor(
    private readonly registroHorasService: RegistroHorasService,
  ) {}

  @Post()
  create(@Body() dto: CreateRegistroHorasDto) {
    return this.registroHorasService.createRegistro(dto);
  }
}