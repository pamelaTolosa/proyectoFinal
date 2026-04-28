import { Module } from "@nestjs/common";
import { UsuarioController } from "./usuario.controller";
import { UsuarioService } from "./usuario.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Usuario } from "./entities/usuario.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [UsuarioController], // <--- ¡AQUÍ ES DONDE OCURRE LA MAGIA!
  providers: [UsuarioService],
})
export class UsuarioModule {}