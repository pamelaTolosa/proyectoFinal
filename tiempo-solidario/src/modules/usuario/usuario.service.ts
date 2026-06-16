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
  // USUARIOS PARA MATCH (🔥 IMPORTANTE)
  // =========================
 async getService(): Promise<Usuario[]> {
  return this.usersRepository.find({
    relations: {
      cursos: true,
    },
  });
}

  // =========================
  // BUSCAR POR DNI
  // =========================
  async findByDni(dni: string) {
    const usuario = await this.usersRepository.findOne({
      where: { dni },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return usuario;
  }

  // =========================
  // CREAR USUARIO
  // =========================
  async postService(userDto: CreateUsuarioDto) {
    const existingCorreo = await this.usersRepository.findOne({
      where: { correo: userDto.correo },
    });

    if (existingCorreo) {
      throw new ConflictException('El correo ya está registrado');
    }

    const existingDni = await this.usersRepository.findOne({
      where: { dni: userDto.dni },
    });

    if (existingDni) {
      throw new ConflictException('El DNI ya está registrado');
    }

    const user = this.usersRepository.create(userDto);

    return this.usersRepository.save(user);
  }

  // =========================
  // FIND ONE
  // =========================
 async findOne(id: number) {
  const usuario = await this.usersRepository.findOne({
    where: { id },
    relations: {
      cursos: true,
    },
    select: {
      id: true,
      nombre: true,
      apellido: true,
      foto: true,
      acercaDeMi: true,
      correo: true,
    },
  });

  if (!usuario) {
    throw new NotFoundException('Usuario no encontrado');
  }

  return usuario;
}

  // =========================
  // SALDO
  // =========================
  async getSaldo(usuarioId: number): Promise<number> {
    const registros = await this.registroRepository.find({
      relations: {
        emisor: true,
        receptor: true,
      },
    });

    return registros.reduce((total, r) => {
      if (r.emisor.id === usuarioId) return total + r.horas;
      if (r.receptor.id === usuarioId) return total - r.horas;
      return total;
    }, 0);
  }
async findById(id: number) {
  return this.usersRepository.findOne({
    where: { id },
  });
}
async findByEmail(correo: string) {
  return this.usersRepository.findOne({
    where: { correo },
  });
}
}