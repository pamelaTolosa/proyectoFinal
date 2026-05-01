import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BilleteraService } from './billetera.service';
import { BilleteraController } from './billetera.controller';
import { BilleteraDeHoras } from './entities/billetera.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BilleteraDeHoras])],
  controllers: [BilleteraController],
  providers: [BilleteraService],
  exports: [TypeOrmModule],
})
export class BilleteraModule {}