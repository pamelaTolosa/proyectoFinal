import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { ValoracionService } from '../valoraciones/valoraciones.service';
import { AuthGuard } from '../../../auth/auth.guard';
import { Public } from '../../../auth/metadata';

@Controller('valoraciones')
export class ValoracionController {
  constructor(
    private readonly valoracionService: ValoracionService,
  ) {}

  // =========================
  // CREAR VALORACIÓN
  // =========================

  @UseGuards(AuthGuard)
  @Post()
  async crearValoracion(
    @Body()
    body: {
      usuarioValoradoId: number;
      puntuacion: number;
    },
    @Req() req,
  ) {
    try {
      console.log('Usuario JWT:', req.user);
      console.log('Body:', body);

      if (!req.user?.sub) {
        throw new Error(
          'Token inválido o sin user.sub',
        );
      }

      return await this.valoracionService.crear(
        req.user.sub,
        body.usuarioValoradoId,
        body.puntuacion,
      );

    } catch (error) {
      console.error(
        'ERROR COMPLETO:',
        error,
      );

      throw error;
    }
  }

  // =========================
  // OBTENER PROMEDIO
  // =========================
 @Public()
@Get('promedio/:id')
async obtenerPromedio(
  @Param('id', ParseIntPipe)
  id: number,
) {
  console.log(
    'ENTRÓ AL GET DE PROMEDIO'
  );

  return this.valoracionService.obtenerPromedio(
    id,
  );
}
@UseGuards(AuthGuard)
@Get('ya-valoro/:id')
async yaValoro(
  @Param('id', ParseIntPipe)
  usuarioValoradoId: number,
  @Req() req,
) {
  return this.valoracionService.yaValoro(
    req.user.sub,
    usuarioValoradoId,
  );
}
@Get('usuario/:usuarioQueValoraId/:usuarioValoradoId')
obtenerValoracion(
  @Param('usuarioQueValoraId', ParseIntPipe)
  usuarioQueValoraId: number,

  @Param('usuarioValoradoId', ParseIntPipe)
  usuarioValoradoId: number,
) {
  return this.valoracionService.obtenerValoracionUsuario(
    usuarioQueValoraId,
    usuarioValoradoId,
  );
}
}