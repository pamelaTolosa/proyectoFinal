import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { Controller, Get, Post, Delete, Put, Body, Param } from '@nestjs/common';



Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usersRepository: Repository<Usuario>,
  ) {}



  getService(): Promise<Usuario[]> {
    return this.usersRepository.find();
  }

 async postService(user: Usuario): Promise<Usuario> {
return this.usersRepository.save(user)
  }



  async deleteService(id: number): Promise<string> {
   const result = await this.usersRepository.delete(id);

    if (result.affected === 0) {
      return 'Usuario no encontrado';
    }

    return 'Usuario eliminado';
  }

  async putService(@Body() updateUser: Usuario): Promise<string> {
    const user = await this.usersRepository.findOneBy({ id: updateUser.id });

  if (!user) {
    return 'Usuario no encontrado!';
  }

  await this.usersRepository.update(updateUser.id, updateUser);

  return 'Usuario actualizado correctamente!';
}
  }