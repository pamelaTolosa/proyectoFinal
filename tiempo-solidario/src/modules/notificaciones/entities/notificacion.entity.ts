import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity()
export class Notificacion {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mensaje: string;

  @Column()
  fecha: string;

  @Column({ default: false })
  leida: boolean;

  @Column({ default: false })
  aprobada: boolean;

  @Column()
  idRegistro: number;

  // 🔥 RECEPTOR
  @ManyToOne(() => Usuario)
  usuario: Usuario;

  // 🔥 EMISOR
  @ManyToOne(() => Usuario)
  emisor: Usuario;
}