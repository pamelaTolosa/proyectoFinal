import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

import { RegistroHoras } from '../../registro-horas/entities/registro-horas.entity';
import { Course } from '../../cursos/entities/curso_entity';
import { Mensaje } from '../../mensajes/entities/mensaje.entity';
import { Valoracion } from '../../valoraciones/entities/valoraciones.entity';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column()
  apellido!: string;

  @Column({ unique: true })
  dni!: string;

  @Column({ type: 'longtext', nullable: true })
  foto!: string;

  @Column()
  fecha_de_nacimiento!: string;

  @Column({ unique: true })
  correo!: string;

  @Column({ type: 'text', nullable: true })
  acercaDeMi!: string;

  @Column()
  contrasenia!: string;

  // ✅ CAMPOS DE PROMEDIO (AGREGADOS)
  @Column({ 
    type: 'decimal', 
    precision: 3, 
    scale: 2, 
    default: 0 
  })
  promedio!: number;

  @Column({ 
    type: 'int', 
    default: 0,
    name: 'cantidad_valoraciones'
  })
  cantidad_valoraciones!: number;

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

  // =========================
  // VALORACIONES
  // =========================

  @OneToMany(
    () => Valoracion,
    (valoracion) => valoracion.usuarioQueValora,
  )
  valoracionesHechas!: Valoracion[];

  @OneToMany(
    () => Valoracion,
    (valoracion) => valoracion.usuarioValorado,
  )
  valoracionesRecibidas!: Valoracion[];
}