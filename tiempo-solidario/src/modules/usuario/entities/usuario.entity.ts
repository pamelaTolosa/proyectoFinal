import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

import { RegistroHoras } from '../../registro-horas/entities/registro-horas.entity';
import { Course } from '../../cursos/entities/curso_entity';
import { Mensaje } from '../../mensajes/entities/mensaje.entity';

@Entity()
export class Usuario {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column()
  apellido!: string;

  @Column({
    unique: true,
  })
  dni!: string;

  @Column({
    type: 'longtext',
    nullable: true,
  })
  foto!: string;

  @Column()
  fecha_de_nacimiento!: string;

  @Column({
    unique: true,
  })
  correo!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  acercaDeMi!: string;

  @Column()
  contrasenia!: string;

  // =========================
  // CURSOS
  // =========================

  @OneToMany(
    () => Course,
    (course) => course.usuario,
  )
  cursos!: Course[];

  // =========================
  // REGISTROS
  // =========================

  @OneToMany(
    () => RegistroHoras,
    (registro) => registro.emisor,
  )
  registrosEmitidos!: RegistroHoras[];

  @OneToMany(
    () => RegistroHoras,
    (registro) => registro.receptor,
  )
  registrosRecibidos!: RegistroHoras[];

  // =========================
  // MENSAJES
  // =========================

  @OneToMany(
    () => Mensaje,
    (mensaje) => mensaje.emisor,
  )
  mensajesEnviados!: Mensaje[];

  @OneToMany(
    () => Mensaje,
    (mensaje) => mensaje.receptor,
  )
  mensajesRecibidos!: Mensaje[];

}