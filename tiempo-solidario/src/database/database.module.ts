// src/database/database.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

import { Usuario } from '../modules/usuario/entities/usuario.entity';
import { UsuarioModule } from '../modules/usuario/usuario.module';
import { AuthModule } from '../../auth/auth.module';

dotenv.config();

console.log('DATABASE_URL:', process.env.DATABASE_URL);

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',

      url: process.env.DATABASE_URL,

      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),

    TypeOrmModule.forFeature([Usuario]),
    UsuarioModule,
    AuthModule,
  ],
})
export class DatabaseModule {}