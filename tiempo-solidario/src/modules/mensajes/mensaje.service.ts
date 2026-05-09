import {
  Injectable,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Mensaje } from './entities/mensaje.entity';
import { Usuario } from '../usuario/entities/usuario.entity';

@Injectable()
export class MensajeService {

  constructor(

    @InjectRepository(Mensaje)
private mensajeRepository: Repository<Mensaje>,

    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  // =========================
  // CREAR MENSAJE
  // =========================

  async crearMensaje(body: any) {

  const emisor =
  await this.usuarioRepository.findOne({
    where: {
      id: body.emisorId,
    },
  });

const receptor =
  await this.usuarioRepository.findOne({
    where: {
      id: body.receptorId,
    },
  });

if (!emisor || !receptor) {
  throw new Error(
    'Usuario no encontrado',
  );
}

   const nuevoMensaje: Partial<Mensaje> = {
  mensaje: body.mensaje,
  emisor,
  receptor,
};

const mensaje =
  this.mensajeRepository.create(
    nuevoMensaje,
  );

    return this.mensajeRepository.save(mensaje);
  }

  // =========================
  // OBTENER MENSAJES
  // =========================

  async obtenerMensajesUsuario(
    usuarioId: number,
  ) {

    return this.mensajeRepository.find({
      where: [
        {
          emisor: {
            id: usuarioId,
          },
        },
        {
          receptor: {
            id: usuarioId,
          },
        },
      ],
      relations: [
        'emisor',
        'receptor',
      ],
      order: {
        fecha: 'DESC',
      },
    });
  }
}