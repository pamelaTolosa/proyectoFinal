import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { BilleteraDeHoras } from './entities/billetera.entity';

import { Usuario } from '../usuario/entities/usuario.entity';

@Injectable()
export class BilleteraService {

  constructor(

    @InjectRepository(BilleteraDeHoras)
    private billeteraRepository: Repository<BilleteraDeHoras>,

    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  // =========================
  // CREAR BILLETERA
  // =========================

  async create(data: any) {

    const usuario =
      await this.usuarioRepository.findOne({
        where: {
          id: data.usuarioId,
        },
      });

    if (!usuario) {
      throw new NotFoundException(
        'Usuario no encontrado',
      );
    }

    const nuevaBilletera =
      this.billeteraRepository.create({
        usuario,
        saldo: data.saldo || 0,
      });

    return this.billeteraRepository.save(
      nuevaBilletera,
    );
  }

  // =========================
  // OBTENER TODAS
  // =========================

  findAll() {

    return this.billeteraRepository.find({
      relations: {'usuario': true},
    });
  }

  // =========================
  // OBTENER POR USUARIO
  // =========================

  async findByUsuario(
    usuarioId: number,
  ) {

    return this.billeteraRepository.findOne({
      where: {
        usuario: {
          id: usuarioId,
        },
      },

      relations: {'usuario': true},
    });
  }
}