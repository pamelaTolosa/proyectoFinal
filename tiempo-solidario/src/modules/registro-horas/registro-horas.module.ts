import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RegistroHoras } from './entities/registro-horas.entity';
import { RegistroHorasService } from './registro-horas.service';
import { RegistroHorasController } from './registro-horas.controller';

import { BilleteraDeHoras } from '../billetera/entities/billetera.entity';
import { NotificacionModule } from '../notificaciones/notificacion.modules';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RegistroHoras,
      BilleteraDeHoras,
    ]),
    NotificacionModule,
  ],

  controllers: [
    RegistroHorasController,
  ],

  providers: [
    RegistroHorasService,
  ],

  exports: [
    RegistroHorasService,
  ],
})
export class RegistroHorasModule {}