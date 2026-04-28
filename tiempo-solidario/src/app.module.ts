// src/app.module.ts
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module'; // Importa tu módulo de BD
import { UsuarioModule } from './modules/usuario/usuario.module'; // Importa tu módulo de usuarios

@Module({
  imports: [
    DatabaseModule, // <--- Con esto, tu app sabe cómo conectarse a la BD
    UsuarioModule,  // <--- Con esto, tu app conoce tus controladores y rutas
  ],
})
export class AppModule {}