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

    const notificacion =
      this.notiRepo.create(data);

    return this.notiRepo.save(
      notificacion
    );
  }

  // =========================
  // POR USUARIO
  // =========================

findByUsuario(userId: number) {

  return this.notiRepo.find({

    where: {

      usuario: {
        id: userId,
      },

      // 🔥 SOLO NO LEÍDAS
      leida: false,
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
  // APROBAR HORAS
  // =========================

  async aprobar(id: number) {

    const noti =
      await this.notiRepo.findOne({

        where: { id },

        relations: {
          usuario: true,
          emisor: true,
        },
      });

    if (!noti) {

      throw new NotFoundException(
        'Notificación no encontrada'
      );
    }

    // =========================
    // APROBAR
    // =========================

    noti.aprobada = true;

    // 🔥 MARCAR COMO LEÍDA
    noti.leida = true;

    await this.notiRepo.save(
      noti
    );

    // =========================
    // CREAR NOTIFICACIÓN
    // PARA EL EMISOR
    // =========================

    const nuevaNoti =
      this.notiRepo.create({

        mensaje:
          `${noti.usuario.nombre} ${noti.usuario.apellido} aprobó tus horas.`,

        fecha:
          new Date().toISOString(),

        leida: false,

        aprobada: true,

        idRegistro:
          noti.idRegistro,

        // 🔥 RECEPTOR
        usuario:
          noti.emisor,

        // 🔥 QUIEN APROBÓ
        emisor:
          noti.usuario,
      });

    await this.notiRepo.save(
      nuevaNoti
    );

    return noti;
  }

  // =========================
  // MARCAR LEÍDAS
  // =========================

  async marcarLeidas(userId: number) {

    const notis =
      await this.notiRepo.find({

        where: {
          usuario: {
            id: userId,
          },
        },
      });

    const actualizadas =
      notis.map((n) => ({

        ...n,

        leida: true,
      }));

    return this.notiRepo.save(
      actualizadas
    );
  }
}