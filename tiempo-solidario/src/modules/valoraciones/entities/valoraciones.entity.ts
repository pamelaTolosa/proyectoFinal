import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from "typeorm";
import { Usuario } from "../../usuario/entities/usuario.entity";

@Unique(["usuarioQueValora", "usuarioValorado"])
@Entity()
export class Valoracion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  puntuacion!: number;

  @ManyToOne(() => Usuario)
  usuarioQueValora!: Usuario;

  @ManyToOne(() => Usuario)
  usuarioValorado!: Usuario;
}