import { Usuario } from './../../usuario/entities/usuario.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('cursos')
export class Course {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre_curso!: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.cursos)
  usuario!: Usuario;
  
}