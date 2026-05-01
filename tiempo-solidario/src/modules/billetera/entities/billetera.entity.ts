import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity()
export class BilleteraDeHoras {

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Usuario)
  @JoinColumn()
  usuario: Usuario;

  @Column({ default: 0 })
  saldo: number;
}