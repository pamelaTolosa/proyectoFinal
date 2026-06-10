import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Course } from './entities/curso_entity';
import { Usuario } from '../usuario/entities/usuario.entity';

import { CreateCourseDto } from './dto/create_curso.dto';
import { UpdateCourseDto } from './dto/update_curso.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,

    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  // =========================
  // TODOS LOS CURSOS
  // =========================
  findAll() {
    return this.courseRepo.find({
      relations: {
        usuario: true,
      },
    });
  }

  // =========================
  // UN CURSO
  // =========================
  findOne(id: number) {
    return this.courseRepo.findOne({
      where: { id },
      relations: {
        usuario: true,
      },
    });
  }

  // =========================
  // CREAR UNO
  // =========================
  async create(userId: number, data: CreateCourseDto) {
    const usuario = await this.usuarioRepo.findOne({
      where: { id: userId },
      relations: {
        cursos: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (usuario.cursos.length >= 10) {
      throw new BadRequestException('Máximo 10 cursos permitidos');
    }

    const course = this.courseRepo.create({
      nombre_curso: data.nombre_curso,
      usuario,
    });

    return this.courseRepo.save(course);
  }

  // =========================
  // CREAR MUCHOS
  // =========================
  async createMany(userId: number, cursosDto: CreateCourseDto[]) {
    const usuario = await this.usuarioRepo.findOne({
      where: { id: userId },
      relations: {
        cursos: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const totalCursos =
      usuario.cursos.length + cursosDto.length;

    if (totalCursos > 10) {
      throw new BadRequestException('Máximo 10 cursos permitidos');
    }

    const cursos = cursosDto.map((c) =>
      this.courseRepo.create({
        nombre_curso: c.nombre_curso,
        usuario,
      }),
    );

    return this.courseRepo.save(cursos);
  }

  // =========================
  // UPDATE
  // =========================
  async update(id: number, data: UpdateCourseDto) {
    const course = await this.courseRepo.findOne({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException('Curso no encontrado');
    }

    course.nombre_curso =
      data.nombre_curso ?? course.nombre_curso;

    return this.courseRepo.save(course);
  }

  // =========================
  // DELETE
  // =========================
  async remove(id: number) {
    const course = await this.courseRepo.findOne({
      where: { id },
      relations: {
        usuario: true,
      },
    });

    if (!course) {
      throw new NotFoundException('Curso no encontrado');
    }

    return this.courseRepo.remove(course);
  }
}