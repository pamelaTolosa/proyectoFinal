import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsuarioModule } from '../src/modules/usuario/usuario.module';
import { AuthController } from './auth.controler';
import { AuthService } from './auth.service';
import { jwtConstants } from './constans';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard'; 
import { Public } from './metadata';



@Module({
  imports: [
    UsuarioModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' }, // TODO: Cambiar a un valor deseado 15m, 1h, etc.
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,{
    provide: APP_GUARD,
    useClass: AuthGuard,
  },],
})
export class AuthModule {}
