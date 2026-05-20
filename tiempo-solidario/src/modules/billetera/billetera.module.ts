import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BilleteraService } from './billetera.service';
import { BilleteraController } from './billetera.controller';
import { BilleteraDeHoras } from './entities/billetera.entity';
import { Usuario } from '../usuario/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BilleteraDeHoras,Usuario])],
  controllers: [BilleteraController],
  providers: [BilleteraService],
  exports: [TypeOrmModule],
})
export class BilleteraModule {}