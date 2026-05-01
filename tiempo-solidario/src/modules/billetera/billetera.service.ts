import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BilleteraDeHoras } from './entities/billetera.entity';

@Injectable()
export class BilleteraService {
  constructor(
    @InjectRepository(BilleteraDeHoras)
    private billeteraRepository: Repository<BilleteraDeHoras>,
  ) {}

  create(data: Partial<BilleteraDeHoras>) {
    const billetera = this.billeteraRepository.create(data);
    return this.billeteraRepository.save(billetera);
  }

  findAll() {
    return this.billeteraRepository.find();
  }
 
}