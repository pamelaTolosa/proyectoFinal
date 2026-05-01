// src/app.module.ts
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module'; // Importa tu módulo de BD
import { UsuarioModule } from './modules/usuario/usuario.module'; // Importa tu módulo de usuarios
import { RegistroHorasModule } from './modules/registro-horas/registro-horas.module'; // Importa tu módulo de registro de horas
import { BilleteraModule } from './modules/billetera/billetera.module';
@Module({
  imports: [
    DatabaseModule, 
    RegistroHorasModule,
    BilleteraModule,
    UsuarioModule
  ],
})
export class AppModule {}