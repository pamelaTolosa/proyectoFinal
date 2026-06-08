// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { Usuario } from '../modules/usuario/entities/usuario.entity';
import { UsuarioModule } from '../modules/usuario/usuario.module';
import { AuthModule } from '../../auth/auth.module';


dotenv.config();

console.log(process.env.DB_USER);

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: false,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([Usuario]),
    UsuarioModule,
    AuthModule,
  ],
})
export class DatabaseModule {}