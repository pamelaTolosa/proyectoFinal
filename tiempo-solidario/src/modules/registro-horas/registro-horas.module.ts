import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RegistroHoras } from './entities/registro-horas.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { BilleteraDeHoras } from '../billetera/entities/billetera.entity';
import { RegistroHorasService } from './registro-horas.service';
import { RegistroHorasController } from './registro-horas.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([RegistroHoras, BilleteraDeHoras]),
  ],
  controllers: [RegistroHorasController],
  providers: [RegistroHorasService],
})
export class RegistroHorasModule {}
