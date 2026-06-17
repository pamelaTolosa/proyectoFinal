// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { Usuario } from '../modules/usuario/entities/usuario.entity';
import { UsuarioModule } from '../modules/usuario/usuario.module';
import { AuthModule } from '../../auth/auth.module';

dotenv.config();

console.log('================ DATABASE CONFIG ================');
console.log('HOST:', process.env.DB_HOST);
console.log('PORT:', process.env.DB_PORT);
console.log('USER:', process.env.DB_USERNAME);
console.log('DATABASE:', process.env.DB_NAME);
console.log('================================================');

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,

      autoLoadEntities: true,
      synchronize: true,

      logging: true, // 👈 IMPORTANTE
    }),

    TypeOrmModule.forFeature([Usuario]),
    UsuarioModule,
    AuthModule,
  ],
})
export class DatabaseModule {}