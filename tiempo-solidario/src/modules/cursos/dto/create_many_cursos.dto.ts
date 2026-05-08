import { IsArray, ArrayMaxSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCourseDto } from './create_curso.dto';

export class CreateManyCoursesDto {
    @IsArray()
    @ArrayMaxSize(10)
    @ValidateNested({ each: true })
    @Type(() => CreateCourseDto)
    cursos!: CreateCourseDto[];
}