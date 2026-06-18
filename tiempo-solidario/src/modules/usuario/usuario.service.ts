import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
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
          promedio: true,
          cantidad_valoraciones: true,
        },
        relations: {
          cursos: true,
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

  async postService(userDto: CreateUsuarioDto) {
    // Validar fecha de nacimiento
    if (!userDto.fecha_de_nacimiento) {
      throw new BadRequestException('La fecha de nacimiento es requerida');
    }

    // Validar edad (mayor de 18 años)
    const fechaNac = new Date(userDto.fecha_de_nacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }

    if (edad < 18) {
      throw new BadRequestException('Debes ser mayor de 18 años para registrarte');
    }

    // Verificar correo existente
    const existingCorreo = await this.usersRepository.findOne({
      where: { correo: userDto.correo },
    });

    if (existingCorreo) {
      throw new ConflictException('El correo ya está registrado');
    }

    // Verificar DNI existente
    const existingDni = await this.usersRepository.findOne({
      where: { dni: userDto.dni },
    });

    if (existingDni) {
      throw new ConflictException('El DNI ya está registrado');
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(userDto.contrasenia, 10);

    // ✅ Crear usuario SIN el campo 'activo'
    const user = this.usersRepository.create({
      nombre: userDto.nombre,
      apellido: userDto.apellido,
      dni: userDto.dni,
      correo: userDto.correo,
      contrasenia: hashedPassword,
      fecha_de_nacimiento: userDto.fecha_de_nacimiento,
      foto: userDto.foto || null,
      acercaDeMi: userDto.acercaDeMi || null,
      promedio: 0,
      cantidad_valoraciones: 0,
      // ✅ activo: true,  // <-- ELIMINADO
    } as any);

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
        fecha_de_nacimiento: true,
        promedio: true,
        cantidad_valoraciones: true,
      },
      relations: {
        cursos: true,
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
  // ACTUALIZAR USUARIO
  // =========================
  async update(id: number, updateData: Partial<Usuario>) {
    const usuario = await this.usersRepository.findOne({
      where: { id },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Si se actualiza la contraseña, hashearla
    if (updateData.contrasenia) {
      updateData.contrasenia = await bcrypt.hash(updateData.contrasenia, 10);
    }

    Object.assign(usuario, updateData);
    return this.usersRepository.save(usuario);
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

  // =========================
  // ELIMINAR USUARIO
  // =========================
  async delete(id: number) {
    const usuario = await this.usersRepository.findOne({
      where: { id },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.usersRepository.remove(usuario);
  }
}