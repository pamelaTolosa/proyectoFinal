import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
} from '@nestjs/common';

import { CourseService } from './curso.service';
import { CreateManyCoursesDto } from './dto/create_many_cursos.dto';
import { CreateCourseDto } from './dto/create_curso.dto'; // <-- IMPORTAR
import { UpdateCourseDto } from './dto/update_curso.dto';

@Controller('cursos')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  // 🔥 Crear muchos cursos (registro)
  @Post(':userId')
  create(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: CreateManyCoursesDto,
  ) {
    return this.courseService.createMany(userId, body.cursos);
  }

  // ✅ Crear un solo curso (Mi Perfil)
  @Post(':userId/uno')
  createOne(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: CreateCourseDto,
  ) {
    return this.courseService.create(userId, body);
  }

  @Get()
  findAll() {
    return this.courseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCourseDto,
  ) {
    return this.courseService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.remove(id);
  }
}