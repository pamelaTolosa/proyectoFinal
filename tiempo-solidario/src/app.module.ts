// src/app.module.ts
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module'; // Importa tu módulo de BD
import { UsuarioModule } from './modules/usuario/usuario.module'; // Importa tu módulo de usuarios
import { RegistroHorasModule } from './modules/registro-horas/registro-horas.module'; // Importa tu módulo de registro de horas
import { BilleteraModule } from './modules/billetera/billetera.module';
import { CourseModule } from './modules/cursos/curso.module';
import { MensajeModule } from './modules/mensajes/mensaje.module';
import { NotificacionModule } from './modules/notificaciones/notificacion.modules';
@Module({
  imports: [
    DatabaseModule, 
    RegistroHorasModule,
    BilleteraModule,
    UsuarioModule,
    CourseModule,
    MensajeModule,
    NotificacionModule,
  ],
})
export class AppModule {}