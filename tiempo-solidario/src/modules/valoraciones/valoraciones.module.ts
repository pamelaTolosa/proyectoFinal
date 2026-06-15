import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Valoracion } from './entities/valoraciones.entity';
import { ValoracionService } from './valoraciones.service';
import { ValoracionController } from './valoraciones.controller';
import { Usuario } from '../usuario/entities/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Valoracion,
      Usuario,
    ]),
  ],
  controllers: [
    ValoracionController,
  ],
  providers: [
    ValoracionService,
  ],
})
export class ValoracionModule {}