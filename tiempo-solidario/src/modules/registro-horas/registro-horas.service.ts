import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RegistroHoras } from './entities/registro-horas.entity';
import { BilleteraDeHoras } from '../billetera/entities/billetera.entity';
import { CreateRegistroHorasDto } from './dto/create-registro-horas.dto';
import { NotificacionService } from '../notificaciones/notificacion.service';

@Injectable()
export class RegistroHorasService {

  private readonly LIMITE_NEGATIVO_RECEPTOR = -3;

  constructor(

    @InjectRepository(RegistroHoras)
    private registroRepository: Repository<RegistroHoras>,

    @InjectRepository(BilleteraDeHoras)
    private billeteraRepository: Repository<BilleteraDeHoras>,

    private notificacionService: NotificacionService,

  ) {}

  // =========================
  // ASEGURAR BILLETERA
  // =========================

  private async asegurarBilletera(usuarioId: number) {

    let wallet =
      await this.billeteraRepository.findOne({
        where: {
          usuario: { id: usuarioId },
        },
      });

    if (!wallet) {

      wallet =
        this.billeteraRepository.create({

          usuario: {
            id: usuarioId,
          },

          saldo: 0,
        });

      await this.billeteraRepository.save(
        wallet
      );
    }
  }

  // =========================
  // SALDO REAL
  // =========================

  private async getSaldo(
    usuarioId: number,
  ): Promise<number> {

    const registros =
      await this.registroRepository.find({

        relations: {
          emisor: true,
          receptor: true,
        },

        where: [
          { emisor: { id: usuarioId } },
          { receptor: { id: usuarioId } },
        ],
      });

    return registros.reduce((total, r) => {

      if (r.emisor.id === usuarioId) {
        return total + r.horas;
      }

      if (r.receptor.id === usuarioId) {
        return total - r.horas;
      }

      return total;

    }, 0);
  }

  // =========================
  // CREAR REGISTRO
  // =========================

  async createRegistro(
    dto: CreateRegistroHorasDto,
  ) {

    if (
      dto.emisor_id === dto.receptor_id
    ) {

      throw new BadRequestException(
        'El emisor y receptor no pueden ser el mismo usuario'
      );
    }

    // 🔥 asegurar billeteras

    await this.asegurarBilletera(
      dto.emisor_id
    );

    await this.asegurarBilletera(
      dto.receptor_id
    );

    // 🔥 billetera receptor

    const walletReceptor =
      await this.billeteraRepository.findOne({

        where: {
          usuario: {
            id: dto.receptor_id,
          },
        },
      });

    if (!walletReceptor) {

      throw new BadRequestException(
        'Billetera no encontrada'
      );
    }

    const saldoFinal =
      walletReceptor.saldo - dto.horas;

    if (
      saldoFinal <
      this.LIMITE_NEGATIVO_RECEPTOR
    ) {

      throw new BadRequestException(
        `El receptor no puede superar deuda de ${this.LIMITE_NEGATIVO_RECEPTOR} horas`
      );
    }

    // =========================
    // CREAR REGISTRO
    // =========================

    const registro =
      this.registroRepository.create({

        fecha: dto.fecha,

        horas: dto.horas,

        emisor: {
          id: dto.emisor_id,
        },

        receptor: {
          id: dto.receptor_id,
        },
      });

    await this.registroRepository.save(
      registro
    );

    // =========================
    // ACTUALIZAR BILLETERA
    // =========================

    await this.billeteraRepository.increment(
      {
        usuario: {
          id: dto.emisor_id,
        },
      },
      'saldo',
      dto.horas,
    );

    await this.billeteraRepository.increment(
      {
        usuario: {
          id: dto.receptor_id,
        },
      },
      'saldo',
      -dto.horas,
    );

    // =========================
    // 🔥 NOTIFICACIÓN
    // =========================

  await this.notificacionService.create({

  mensaje:
    `Te registraron ${dto.horas} horas`,

  fecha: dto.fecha,

  idRegistro: registro.id,

  usuario: {
    id: dto.receptor_id,
  } as any,

  emisor: {
    id: dto.emisor_id,
  } as any,

});

// =========================
// RETURN
// =========================

return registro;
}
// =========================
// TODOS
// =========================

// =========================
// TODOS
// =========================

findAll() {

  return this.registroRepository.find({
    relations: {
      emisor: true,
      receptor: true,
    },
  });
}

// =========================
// POR USUARIO
// =========================

findByUsuario(id: number) {

  return this.registroRepository.find({

    where: [
      { emisor: { id } },
      { receptor: { id } },
    ],

    relations: {
      emisor: true,
      receptor: true,
    },
  });
}
}