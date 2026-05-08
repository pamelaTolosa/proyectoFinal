import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RegistroHoras } from '../../registro-horas/entities/registro-horas.entity';
import { Course } from '../../cursos/entities/curso_entity';
import { MaxLength } from 'class-validator/types/decorator/string/MaxLength';
import { IsString } from 'class-validator/types/decorator/typechecker/IsString';

@Entity()
export class Usuario {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column()
  apellido!: string;

  @Column({
    type: 'longtext',
    nullable: true,
  })
  @Column('longtext', { nullable: true })
  foto?: string;
  @Column()
  correo!: string;

  @Column()
  acerca_de_mi!: string;

  @Column()
  contrasenia!: string;

  @OneToMany(() => RegistroHoras, (registro) => registro.emisor)
  registrosEmitidos!: RegistroHoras[];

  @OneToMany(() => RegistroHoras, (registro) => registro.receptor)
  registrosRecibidos!: RegistroHoras[];
  @OneToMany(() => Course, (course) => course.usuario)
  cursos!: Course[];
}