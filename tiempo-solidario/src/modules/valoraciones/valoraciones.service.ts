import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Valoracion } from './entities/valoraciones.entity';
import { Usuario } from '../usuario/entities/usuario.entity';

@Injectable()
export class ValoracionService {
  constructor(
    @InjectRepository(Valoracion)
    private readonly valoracionRepository: Repository<Valoracion>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  // =========================
  // CREAR VALORACIÓN
  // =========================
  async crear(
    usuarioQueValoraId: number,
    usuarioValoradoId: number,
    puntuacion: number,
  ) {
    // Validar que no sea el mismo usuario
    if (usuarioQueValoraId === usuarioValoradoId) {
      throw new BadRequestException('No puedes valorarte a ti mismo');
    }

    // Validar puntuación
    if (puntuacion < 1 || puntuacion > 5) {
      throw new BadRequestException('La puntuación debe ser entre 1 y 5');
    }

    // Verificar si el usuario valorado existe
    const usuarioValorado = await this.usuarioRepository.findOne({
      where: { id: usuarioValoradoId }
    });

    if (!usuarioValorado) {
      throw new NotFoundException('Usuario a valorar no encontrado');
    }

    // Verificar si ya existe una valoración
    const existing = await this.valoracionRepository.findOne({
      where: {
        usuarioQueValoraId: usuarioQueValoraId,
        usuarioValoradoId: usuarioValoradoId,
      },
    });

    if (existing) {
      throw new ConflictException('Ya valoraste a este usuario');
    }

    // Crear la valoración
    const valoracion = this.valoracionRepository.create({
      puntuacion,
      usuarioQueValoraId: usuarioQueValoraId,
      usuarioValoradoId: usuarioValoradoId,
    });

    try {
      const nuevaValoracion = await this.valoracionRepository.save(valoracion);
      
      // Actualizar el promedio del usuario valorado
      await this.actualizarPromedioUsuario(usuarioValoradoId);
      
      // Obtener el promedio actualizado
      const promedioActualizado = await this.obtenerPromedio(usuarioValoradoId);
      
      return {
        message: 'Valoración creada exitosamente',
        valoracion: nuevaValoracion,
        promedio: promedioActualizado.promedio,
        cantidad: promedioActualizado.cantidad,
      };
      
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.message.includes('duplicate key')) {
          throw new ConflictException('Ya has valorado a este usuario');
        }
        throw new BadRequestException('Error al crear la valoración');
      }
      throw error;
    }
  }

  // =========================
  // ACTUALIZAR PROMEDIO DEL USUARIO (VERSIÓN CORREGIDA)
  // =========================
  async actualizarPromedioUsuario(usuarioId: number) {
    // Obtener todas las valoraciones del usuario
    const valoraciones = await this.valoracionRepository.find({
      where: {
        usuarioValoradoId: usuarioId
      }
    });

    const cantidad = valoraciones.length;
    let promedio = 0;

    if (cantidad > 0) {
      const suma = valoraciones.reduce((acc, v) => acc + v.puntuacion, 0);
      promedio = suma / cantidad;
    }

    // ✅ Usar save en lugar de update para evitar problemas de tipos
    const usuario = await this.usuarioRepository.findOne({
      where: { id: usuarioId }
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Actualizar los campos
    usuario.promedio = Math.round(promedio * 100) / 100;
    usuario.cantidad_valoraciones = cantidad;

    // Guardar el usuario
    await this.usuarioRepository.save(usuario);

    return { promedio, cantidad };
  }

  // =========================
  // PROMEDIO DE VALORACIONES
  // =========================
  async obtenerPromedio(usuarioId: number) {
    // Verificar que el usuario existe
    const usuario = await this.usuarioRepository.findOne({
      where: { id: usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Calcular promedio
    const resultado = await this.valoracionRepository
      .createQueryBuilder('valoracion')
      .select('AVG(valoracion.puntuacion)', 'promedio')
      .addSelect('COUNT(valoracion.id)', 'cantidad')
      .where('valoracion.usuarioValoradoId = :usuarioId', {
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
  // YA VALORÓ (VERIFICAR)
  // =========================
  async yaValoro(
    usuarioQueValoraId: number,
    usuarioValoradoId: number,
  ) {
    const valoracion = await this.valoracionRepository.findOne({
      where: {
        usuarioQueValoraId: usuarioQueValoraId,
        usuarioValoradoId: usuarioValoradoId,
      },
    });

    return {
      yaValoro: !!valoracion,
      valoracion: valoracion || null,
    };
  }

  // =========================
  // OBTENER VALORACIÓN ESPECÍFICA
  // =========================
  async obtenerValoracionUsuario(
    usuarioQueValoraId: number,
    usuarioValoradoId: number,
  ) {
    const valoracion = await this.valoracionRepository.findOne({
      where: {
        usuarioQueValoraId: usuarioQueValoraId,
        usuarioValoradoId: usuarioValoradoId,
      },
      relations: {
        usuarioQueValora: true,
        usuarioValorado: true,
      },
    });

    return {
      existe: !!valoracion,
      valoracion: valoracion || null,
    };
  }

  // =========================
  // OBTENER TODAS LAS VALORACIONES DE UN USUARIO
  // =========================
  async obtenerValoracionesDeUsuario(usuarioId: number) {
    const valoraciones = await this.valoracionRepository.find({
      where: {
        usuarioQueValoraId: usuarioId
      },
      relations: {
        usuarioValorado: true,
      },
      order: {
        fecha_creacion: 'DESC',
      },
    });

    return valoraciones;
  }

  // =========================
  // OBTENER USUARIOS VALORADOS POR UN USUARIO
  // =========================
  async obtenerUsuariosValorados(usuarioId: number) {
    const valoraciones = await this.valoracionRepository.find({
      where: {
        usuarioQueValoraId: usuarioId
      },
      relations: {
        usuarioValorado: true,
      },
    });

    return valoraciones.map(v => ({
      id: v.usuarioValorado.id,
      nombre: v.usuarioValorado.nombre,
      apellido: v.usuarioValorado.apellido,
      puntuacion: v.puntuacion,
      fecha: v.fecha_creacion,
    }));
  }

  // =========================
  // OBTENER VALORACIONES RECIBIDAS POR UN USUARIO
  // =========================
  async obtenerValoracionesRecibidas(usuarioId: number) {
    const valoraciones = await this.valoracionRepository.find({
      where: {
        usuarioValoradoId: usuarioId
      },
      relations: {
        usuarioQueValora: true,
      },
      order: {
        fecha_creacion: 'DESC',
      },
    });

    return valoraciones;
  }

  // =========================
  // OBTENER PROMEDIO CON DETALLE
  // =========================
  async obtenerPromedioConDetalle(usuarioId: number) {
    const valoraciones = await this.valoracionRepository.find({
      where: {
        usuarioValoradoId: usuarioId
      },
      relations: {
        usuarioQueValora: true,
      },
    });

    const cantidad = valoraciones.length;
    let promedio = 0;
    const distribucion = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    if (cantidad > 0) {
      const suma = valoraciones.reduce((acc, v) => {
        distribucion[v.puntuacion] = (distribucion[v.puntuacion] || 0) + 1;
        return acc + v.puntuacion;
      }, 0);
      promedio = suma / cantidad;
    }

    return {
      promedio: Math.round(promedio * 100) / 100,
      cantidad,
      distribucion,
      valoraciones,
    };
  }

  // =========================
  // ELIMINAR VALORACIÓN
  // =========================
  async eliminarValoracion(
    usuarioQueValoraId: number,
    usuarioValoradoId: number,
  ) {
    const valoracion = await this.valoracionRepository.findOne({
      where: {
        usuarioQueValoraId: usuarioQueValoraId,
        usuarioValoradoId: usuarioValoradoId,
      },
    });

    if (!valoracion) {
      throw new NotFoundException('Valoración no encontrada');
    }

    await this.valoracionRepository.remove(valoracion);
    
    // Actualizar el promedio después de eliminar
    await this.actualizarPromedioUsuario(usuarioValoradoId);
    
    return {
      message: 'Valoración eliminada exitosamente',
    };
  }

  // =========================
  // OBTENER VALORACIONES PENDIENTES
  // =========================
  async obtenerValoracionesPendientes(usuarioId: number) {
    const valoracionesRealizadas = await this.valoracionRepository.find({
      where: {
        usuarioQueValoraId: usuarioId
      }
    });

    const usuariosValoradosIds = valoracionesRealizadas.map(v => v.usuarioValoradoId);

    const valoracionesRecibidas = await this.valoracionRepository.find({
      where: {
        usuarioValoradoId: usuarioId
      },
      relations: {'usuarioQueValora': true}
    });

    const pendientes = valoracionesRecibidas
      .filter(v => !usuariosValoradosIds.includes(v.usuarioQueValoraId))
      .map(v => ({
        usuarioId: v.usuarioQueValora.id,
        nombre: v.usuarioQueValora.nombre,
        apellido: v.usuarioQueValora.apellido,
        puntuacionRecibida: v.puntuacion,
        fecha: v.fecha_creacion,
      }));

    return pendientes;
  }
  
}