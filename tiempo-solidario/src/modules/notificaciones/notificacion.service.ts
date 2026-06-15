import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Notificacion } from './entities/notificacion.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { BilleteraDeHoras } from '../billetera/entities/billetera.entity';

@Injectable()
export class NotificacionService {
  constructor(
    @InjectRepository(Notificacion)
    private notiRepo: Repository<Notificacion>,

    @InjectRepository(BilleteraDeHoras)
    private billeteraRepo: Repository<BilleteraDeHoras>,

    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
  ) {}

  // =========================
  // CREAR NOTIFICACIÓN
  // =========================
  async create(data: Partial<Notificacion>) {
    const notificacion = this.notiRepo.create(data);
    return this.notiRepo.save(notificacion);
  }

  // =========================
  // POR USUARIO (FIX IMPORTANTE)
  // =========================
  findByUsuario(userId: number) {
    return this.notiRepo.find({
      where: {
        usuario: {
          id: userId,
        },
      },
      relations: {
        usuario: true,
        emisor: true,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  // =========================
  // APROBAR HORAS (ROBUSTO)
  // =========================
  async aprobar(id: number) {
    const noti = await this.notiRepo.findOne({
      where: { id },
      relations: {
        usuario: true,
        emisor: true,
      },
    });

    if (!noti) {
      throw new NotFoundException('Notificación no encontrada');
    }

    // =========================
    // ACTUALIZAR ORIGINAL
    // =========================
    noti.aprobada = true;
    noti.leida = true;

    await this.notiRepo.save(noti);

    // =========================
    // VALIDACIÓN SEGURA
    // =========================
    if (!noti.usuario || !noti.emisor) {
      throw new NotFoundException('Relaciones inválidas en notificación');
    }

    // =========================
    // CREAR NOTIFICACIÓN AL EMISOR
    // =========================
    const nuevaNoti = this.notiRepo.create({
      mensaje: `${noti.usuario.nombre} ${noti.usuario.apellido} aprobó tus horas.`,
      fecha: new Date().toISOString(),
      leida: false,
      aprobada: true,
      idRegistro: noti.idRegistro,

      usuario: noti.emisor, // receptor
      emisor: noti.usuario, // quien aprobó
    });

    await this.notiRepo.save(nuevaNoti);

    return noti;
  }

  // =========================
  // MARCAR LEÍDAS (FIX SEGURO)
  // =========================
  async marcarLeidas(userId: number) {
    await this.notiRepo.update(
      { usuario: { id: userId } },
      { leida: true },
    );

    return { ok: true };
  }
}