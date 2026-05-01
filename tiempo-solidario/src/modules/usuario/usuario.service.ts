import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import{ RegistroHoras } from '../registro-horas/entities/registro-horas.entity';

import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Injectable()
export class UsuarioService {

constructor(
  @InjectRepository(Usuario)
  private usersRepository: Repository<Usuario>,

  @InjectRepository(RegistroHoras) 
  private registroRepository: Repository<RegistroHoras>,
) {}

  async getService(): Promise<Usuario[]> {
    return this.usersRepository.find({
      relations: ['registrosEmitidos', 'registrosRecibidos'], 
    });
  }

 async postService(userDto: CreateUsuarioDto) {

  const existing = await this.usersRepository.findOneBy({
    correo: userDto.correo,
  });

  if (existing) {
    throw new ConflictException('El correo ya está registrado');
  }

  const user = this.usersRepository.create(userDto);
  return this.usersRepository.save(user);

}
 async getSaldo(usuarioId: number): Promise<number> {

  const registros = await this.registroRepository.find({
    relations: ['emisor', 'receptor'],
  });

  return registros.reduce((total, r) => {

    if (r.emisor.id === usuarioId) {
      return total + r.horas; // suma
    }

    if (r.receptor.id === usuarioId) {
      return total - r.horas; // resta
    }

    return total;

  }, 0);
}
}