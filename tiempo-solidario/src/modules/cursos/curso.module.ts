import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/curso_entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { CourseService } from './curso.service';
import { CourseController } from './curso.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Usuario])],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}