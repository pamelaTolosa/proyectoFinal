import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Notificacion } from './entities/notificacion.entity';
import { Usuario } from '../usuario/entities/usuario.entity';

@Injectable()
export class NotificacionService {

  constructor(

    @InjectRepository(Notificacion)
    private notiRepo: Repository<Notificacion>,

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
      },

      relations: [
        'usuario',
        'emisor',
      ],

      order: {
        id: 'DESC',
      },
    });
  }

  // =========================
  // APROBAR HORAS
  // =========================

 async aprobar(id: number) {

  const noti = await this.notiRepo.findOne({

    where: { id },

    relations: [
      'usuario',
      'emisor',
    ],
  });

  if (!noti) {
    throw new Error('Notificación no encontrada');
  }

  // =========================
  // APROBAR
  // =========================

  noti.aprobada = true;

  await this.notiRepo.save(noti);

  // =========================
  // CREAR NOTIFICACIÓN
  // PARA EL EMISOR
  // =========================

  const nuevaNoti = this.notiRepo.create({

    mensaje:
      `${noti.usuario.nombre} ${noti.usuario.apellido} aprobó tus horas.`,

    fecha: new Date().toISOString(),

    leida: false,

    aprobada: true,

    idRegistro: noti.idRegistro,

    // 🔥 ahora el receptor es el EMISOR ORIGINAL
    usuario: noti.emisor,

    // 🔥 quien aprobó
    emisor: noti.usuario,
  });

  await this.notiRepo.save(nuevaNoti);

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