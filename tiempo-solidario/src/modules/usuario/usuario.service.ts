import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { RegistroHoras } from '../registro-horas/entities/registro-horas.entity';

import { Usuario } from './entities/usuario.entity';

import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Injectable()
export class UsuarioService {

  constructor(

    @InjectRepository(Usuario)
    private usersRepository: Repository<Usuario>,

    @InjectRepository(RegistroHoras)
    private registroRepository: Repository<RegistroHoras>,

  ) {}

  // =========================
  // OBTENER TODOS
  // =========================

  async getService(): Promise<Usuario[]> {

    return this.usersRepository.find({

      relations: [
        'cursos',
        'registrosEmitidos',
        'registrosRecibidos',
        'mensajesEnviados',
        'mensajesRecibidos',
      ],

    });
  }

  // =========================
  // CREAR USUARIO
  // =========================

  async postService(
    userDto: CreateUsuarioDto,
  ) {

    const existing =
      await this.usersRepository.findOneBy({
        correo: userDto.correo,
      });

    if (existing) {

      throw new ConflictException(
        'El correo ya está registrado',
      );
    }

    const user =
      this.usersRepository.create(
        userDto,
      );

    return this.usersRepository.save(
      user,
    );
  }

  // =========================
  // SALDO
  // =========================

  async getSaldo(
    usuarioId: number,
  ): Promise<number> {

    const registros =
      await this.registroRepository.find({

        relations: [
          'emisor',
          'receptor',
        ],

      });

    return registros.reduce(
      (total, r) => {

        if (
          r.emisor.id === usuarioId
        ) {

          return total + r.horas;
        }

        if (
          r.receptor.id === usuarioId
        ) {

          return total - r.horas;
        }

        return total;

      },
      0,
    );
  }

  // =========================
  // BUSCAR USUARIO POR ID
  // =========================

  async findOne(id: number) {

    const usuario =
      await this.usersRepository.findOne({

        where: {
          id,
        },

        relations: [
          'cursos',
          'registrosEmitidos',
          'registrosRecibidos',
          'mensajesEnviados',
          'mensajesRecibidos',
        ],

      });

    if (!usuario) {

      throw new NotFoundException(
        'Usuario no encontrado',
      );
    }

    return usuario;
  }

  // =========================
  // LOGIN
  // =========================

  async login(
    correo: string,
    contrasenia: string,
  ) {

    const usuario =
      await this.usersRepository.findOne({

        where: {
          correo,
          contrasenia,
        },

        relations: [
          'cursos',
          'mensajesEnviados',
          'mensajesRecibidos',
        ],

      });

    if (!usuario) {

      throw new NotFoundException(
        'Correo o contraseña incorrectos',
      );
    }

    return usuario;
  }
}