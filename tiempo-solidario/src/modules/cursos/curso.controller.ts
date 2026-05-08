import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { CourseService } from './curso.service';
import { CreateManyCoursesDto } from './dto/create_many_cursos.dto';
import { UpdateCourseDto } from './dto/update_curso.dto';

@Controller('cursos')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  // 🔥 Crear uno o muchos cursos (SIEMPRE array)
  @Post(':userId')
  create(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: CreateManyCoursesDto,
  ) {
    return this.courseService.createMany(userId, body.cursos);
  }

  // 📥 Obtener todos
  @Get()
  findAll() {
    return this.courseService.findAll();
  }

  // 📥 Obtener uno
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.findOne(id);
  }

  // ✏️ Actualizar
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCourseDto,
  ) {
    return this.courseService.update(id, body);
  }

  // 🗑️ Eliminar
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.remove(id);
  }
}