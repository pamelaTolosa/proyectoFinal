import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  cursos_brindados!: string;
    
}