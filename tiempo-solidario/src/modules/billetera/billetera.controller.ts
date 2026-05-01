import { Controller, Post, Body, Get } from '@nestjs/common';
import { BilleteraService } from './billetera.service';

@Controller('/billetera')
export class BilleteraController {

  constructor(private readonly billeteraService: BilleteraService) {}

  @Post()
  create(@Body() body: any) {
    return this.billeteraService.create(body);
  }

  @Get()
  findAll() {
    return this.billeteraService.findAll();
  }
}