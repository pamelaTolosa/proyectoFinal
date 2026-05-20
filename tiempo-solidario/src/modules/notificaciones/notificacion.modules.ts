import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificacionService } from './notificacion.service';
import { NotificacionController } from './notificacion.controller';
import { Notificacion } from './entities/notificacion.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { RegistroHoras } from '../registro-horas/entities/registro-horas.entity';
;

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Notificacion,
            RegistroHoras,
            Usuario,
        ]),
    ],

    controllers: [NotificacionController],

    providers: [NotificacionService],
    exports: [NotificacionService],
})
export class NotificacionModule { }