import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Mensaje } from './entities/mensaje.entity';
import { Usuario } from '../usuario/entities/usuario.entity';

import { MensajeController } from './mensaje.controller';
import { MensajeService } from './mensaje.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Mensaje,
      Usuario,
    ]),
  ],
  controllers: [MensajeController],
  providers: [MensajeService],
})
export class MensajeModule {}