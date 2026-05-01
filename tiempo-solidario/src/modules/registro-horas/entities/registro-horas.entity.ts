import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity('registro_de_horas')
export class RegistroHoras {

  @PrimaryGeneratedColumn()
  id: number;

  // 📅 Fecha del intercambio
  @Column({ type: 'date' })
  fecha: Date;

  // ⏱ Cantidad de horas (SIEMPRE POSITIVO)
  @Column({ type: 'int' })
  horas: number;

  // 👤 Usuario que brinda el servicio (GANA horas)
  @ManyToOne(() => Usuario, (usuario) => usuario.registrosEmitidos, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'emisor_id' })
  emisor!: Usuario;

  // 👤 Usuario que recibe el servicio (GASTA horas)
  @ManyToOne(() => Usuario, (usuario) => usuario.registrosRecibidos, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'receptor_id' })
  receptor!: Usuario;
}