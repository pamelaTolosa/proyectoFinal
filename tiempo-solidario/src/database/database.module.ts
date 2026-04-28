// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Aquí van tus entidades (ts files con @Entity)
import { Usuario } from '../modules/usuario/entities/usuario.entity';

import * as dotenv from 'dotenv';

dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT!, 10),
      username: process.env.DB_USERNAME!,
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_NAME!,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true, // solo en DEV
    }),
  ],
})
export class DatabaseModule {}