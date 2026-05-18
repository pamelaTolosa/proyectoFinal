import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { RegistroHoras } from '../registro-horas/entities/registro-horas.entity';

import { Usuario } from './entities/usuario.entity';

import {CreateUsuarioDto } from './dto/create-usuario.dto';

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
async findByDni(
  dni: string,
) {

  const usuario =
    await this.usersRepository.findOne({
      where: {
        dni,
      },
    });

  if (!usuario) {

    throw new NotFoundException(
      'Usuario no encontrado',
    );
  }

  return usuario;
}
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

    // =========================
    // VALIDAR CORREO
    // =========================

    const existingCorreo =
      await this.usersRepository.findOneBy({
        correo: userDto.correo,
      });

    if (existingCorreo) {

      throw new ConflictException(
        'El correo ya está registrado',
      );
    }

    // =========================
    // VALIDAR DNI
    // =========================

    const existingDni =
      await this.usersRepository.findOneBy({
        dni: userDto.dni,
      });

    if (existingDni) {

      throw new ConflictException(
        'El DNI ya está registrado',
      );
    }

    // =========================
    // CREAR USUARIO
    // =========================

    const user =
      this.usersRepository.create({

        nombre: userDto.nombre,

        apellido: userDto.apellido,

        dni: userDto.dni,

        correo: userDto.correo,

        contrasenia:
          userDto.contrasenia,

        fecha_de_nacimiento:
          userDto.fecha_de_nacimiento,

        acercaDeMi:
          userDto.acercaDeMi,

        foto: userDto.foto,

      });

    return this.usersRepository.save(
      user,
    );
  }
  async create(createUsuarioDto: CreateUsuarioDto) {

  console.log("DTO:");
  console.log(createUsuarioDto);

  const usuario = this.usersRepository.create(createUsuarioDto);

  console.log("USUARIO:");
  console.log(usuario);

  return this.usersRepository.save(usuario);
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