import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn,
  CreateDateColumn,
  Unique 
} from "typeorm";
import { Usuario } from "../../usuario/entities/usuario.entity";

@Unique(["usuarioQueValoraId", "usuarioValoradoId"])
@Entity("valoraciones")
export class Valoracion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  puntuacion!: number;

  @CreateDateColumn({ 
    name: "fecha_creacion",
    type: "timestamp" 
  })
  fecha_creacion!: Date;

  // ✅ Agregar columnas explícitas para las relaciones
  @Column({ name: "usuarioQueValoraId" })
  usuarioQueValoraId!: number;

  @Column({ name: "usuarioValoradoId" })
  usuarioValoradoId!: number;

  // Relaciones
  @ManyToOne(() => Usuario)
  @JoinColumn({ name: "usuarioQueValoraId" })
  usuarioQueValora!: Usuario;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: "usuarioValoradoId" })
  usuarioValorado!: Usuario;
}