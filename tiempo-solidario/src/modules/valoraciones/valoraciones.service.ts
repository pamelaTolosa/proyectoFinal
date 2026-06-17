import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';

import { Valoracion } from './entities/valoraciones.entity';

@Injectable()
export class ValoracionService {
  constructor(
    @InjectRepository(Valoracion)
    private readonly valoracionRepository: Repository<Valoracion>,
  ) {}

  // =========================
  // CREAR VALORACIÓN (HARD LOCK)
  // =========================
  async crear(
    usuarioQueValoraId: number,
    usuarioValoradoId: number,
    puntuacion: number,
  ) {
    const valoracion = this.valoracionRepository.create({
      puntuacion,
      usuarioQueValora: { id: usuarioQueValoraId } as any,
      usuarioValorado: { id: usuarioValoradoId } as any,
    });
const existing = await this.valoracionRepository.findOne({
  where: {
    usuarioQueValora: { id: usuarioQueValoraId },
    usuarioValorado: { id: usuarioValoradoId },
  },
});

if (existing) {
  throw new ConflictException('Ya valoraste a este usuario');
}
    try {
      return await this.valoracionRepository.save(valoracion);
    } catch (error) {
      // 🔥 DUPLICADO REAL (DB UNIQUE constraint)
      if (error instanceof QueryFailedError) {
        throw new BadRequestException(
          'Ya has valorado a este usuario',
        );
      }

      throw error;
    }
  }

  // =========================
  // PROMEDIO DE VALORACIONES
  // =========================
  async obtenerPromedio(usuarioId: number) {
    const resultado = await this.valoracionRepository
      .createQueryBuilder('valoracion')
      .select('AVG(valoracion.puntuacion)', 'promedio')
      .addSelect('COUNT(valoracion.id)', 'cantidad')
      .where('valoracion.usuarioValorado.id = :usuarioId', {
        usuarioId,
      })
      .getRawOne();

    return {
      promedio: resultado?.promedio
        ? parseFloat(Number(resultado.promedio).toFixed(1))
        : 0,
      cantidad: Number(resultado?.cantidad) || 0,
    };
  }

  // =========================
  // YA VALORÓ
  // =========================
  async yaValoro(
    usuarioQueValoraId: number,
    usuarioValoradoId: number,
  ) {
    const valoracion =
      await this.valoracionRepository.findOne({
        where: {
          usuarioQueValora: {
            id: usuarioQueValoraId,
          },
          usuarioValorado: {
            id: usuarioValoradoId,
          },
        },
      });

    return !!valoracion;
  }

  // =========================
  // OBTENER VALORACIÓN
  // =========================
  async obtenerValoracionUsuario(
    usuarioQueValoraId: number,
    usuarioValoradoId: number,
  ) {
    return this.valoracionRepository.findOne({
      where: {
        usuarioQueValora: {
          id: usuarioQueValoraId,
        },
        usuarioValorado: {
          id: usuarioValoradoId,
        },
      },
      relations: {
        usuarioQueValora: true,
        usuarioValorado: true,
      },
    });
  }
}