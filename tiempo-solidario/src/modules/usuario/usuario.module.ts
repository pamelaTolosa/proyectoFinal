import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { RegistroHoras } from '../registro-horas/entities/registro-horas.entity';
import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Usuario, RegistroHoras])],
  controllers: [UsuarioController],
  providers: [UsuarioService],
})
export class UsuarioModule {}
