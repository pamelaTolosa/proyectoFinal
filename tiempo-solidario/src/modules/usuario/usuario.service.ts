import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

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
  ) { }

  // =========================
  // LISTAR USUARIOS (CON CURSOS)
  // =========================
  async getService(): Promise<Partial<Usuario>[]> {
    try {
      return await this.usersRepository.find({
        select: {
          id: true,
          nombre: true,
          apellido: true,
          correo: true,
          foto: true,
          acercaDeMi: true,
        },
        relations: {
          cursos: true, // 🟢 Trae los cursos vinculados para la pantalla de Matcheo
        },
      });
    } catch (error) {
      console.error('ERROR getService:', error);
      throw new Error('Error al obtener usuarios');
    }
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
  // CREAR USUARIO (COMPLETAMENTE BLINDADO)
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

    // Hasheamos ÚNICAMENTE la contraseña
    const hashedPassword = await bcrypt.hash(userDto.contrasenia, 10);

    // Mapeo explícito paso a paso para evitar que el operador `...` propague errores
    const user = this.usersRepository.create({
      nombre: userDto.nombre,
      apellido: userDto.apellido,
      dni: userDto.dni,
      correo: userDto.correo,
      foto: userDto.foto,
      acercaDeMi: userDto.acercaDeMi, // Pasa limpio como texto plano
      contrasenia: hashedPassword,    // Único campo con hash
    });

    return this.usersRepository.save(user);
  }

  // =========================
  // LOGIN (SEGURO)
  // =========================
  async login(correo: string, contrasenia: string) {
    const user = await this.usersRepository.findOne({
      where: { correo },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const isValid = await bcrypt.compare(contrasenia, user.contrasenia);

    if (!isValid) {
      throw new ConflictException('Contraseña incorrecta');
    }

    return user;
  }

  // =========================
  // FIND ONE (CON CURSOS PARA PERFIL)
  // =========================
  async findOne(id: number) {
    const usuario = await this.usersRepository.findOne({
      where: { id },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        foto: true,
        acercaDeMi: true,
        correo: true,
      },
      relations: {
        cursos: true, // 🟢 Trae los cursos vinculados para la vista de Mi Perfil
      },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return usuario;
  }

  // =========================
  // FIND BY ID
  // =========================
  async findById(id: number) {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  // =========================
  // FIND BY EMAIL
  // =========================
  async findByEmail(correo: string) {
    return this.usersRepository.findOne({
      where: { correo },
    });
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
      if (r?.emisor?.id === usuarioId) return total + r.horas;
      if (r?.receptor?.id === usuarioId) return total - r.horas;
      return total;
    }, 0);
  }
}