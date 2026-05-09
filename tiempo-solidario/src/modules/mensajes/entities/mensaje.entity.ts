import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity()
export class Mensaje {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  mensaje!: string;

  @CreateDateColumn()
  fecha!: Date;

  @ManyToOne(
    () => Usuario,
    (usuario) => usuario.mensajesEnviados,
  )
  emisor!: Usuario;

  @ManyToOne(
    () => Usuario,
    (usuario) => usuario.mensajesRecibidos,
  )
  receptor!: Usuario;
}