import { IsNumber } from 'class-validator';

export class DeleteCourseDto {
  @IsNumber()
  id: number;
}