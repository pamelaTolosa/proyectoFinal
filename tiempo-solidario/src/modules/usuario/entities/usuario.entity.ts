import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RegistroHoras } from '../../registro-horas/entities/registro-horas.entity';

@Entity()
export class Usuario {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

 @Column()
  apellido!: string;

  @Column()
  foto!: string;

  @Column()
  fecha_de_nacimiento!: Date;

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
}