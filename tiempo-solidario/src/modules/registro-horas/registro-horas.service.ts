import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RegistroHoras } from './entities/registro-horas.entity';
import { BilleteraDeHoras } from '../billetera/entities/billetera.entity';
import { CreateRegistroHorasDto } from './dto/create-registro-horas.dto';

@Injectable()
export class RegistroHorasService {

  private readonly LIMITE_NEGATIVO_RECEPTOR = -3;

  constructor(
    @InjectRepository(RegistroHoras)
    private registroRepository: Repository<RegistroHoras>,

    @InjectRepository(BilleteraDeHoras)
    private billeteraRepository: Repository<BilleteraDeHoras>,
  ) {}
private async asegurarBilletera(usuarioId: number) {
    let wallet = await this.billeteraRepository.findOne({
      where: { usuario: { id: usuarioId } },
    });

    if (!wallet) {
      wallet = this.billeteraRepository.create({
        usuario: { id: usuarioId },
        saldo: 0,
      });

      await this.billeteraRepository.save(wallet);
    }
  }

  // 🔥 SALDO REAL
  private async getSaldo(usuarioId: number): Promise<number> {

    const registros = await this.registroRepository.find({
      relations: ['emisor', 'receptor'],
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

  // 🧠 CREAR REGISTRO
 async createRegistro(dto: CreateRegistroHorasDto) {

  if (dto.emisor_id === dto.receptor_id) {
    throw new BadRequestException(
      'El emisor y receptor no pueden ser el mismo usuario'
    );
  }

  // 🔥 asegurar billeteras
  await this.asegurarBilletera(dto.emisor_id);
  await this.asegurarBilletera(dto.receptor_id);

  // 🔥 traer billetera REAL del receptor
  const walletReceptor = await this.billeteraRepository.findOne({
    where: { usuario: { id: dto.receptor_id } },
  });

  if (!walletReceptor) {
    throw new BadRequestException('Billetera no encontrada');
  }

  const saldoFinal = walletReceptor.saldo - dto.horas;

  // 🚨 VALIDACIÓN REAL
  if (saldoFinal < this.LIMITE_NEGATIVO_RECEPTOR) {
    throw new BadRequestException(
      `El receptor no puede superar deuda de ${this.LIMITE_NEGATIVO_RECEPTOR} horas`
    );
  }

  // 🔥 crear registro
  const registro = this.registroRepository.create({
    fecha: dto.fecha,
    horas: dto.horas,
    emisor: { id: dto.emisor_id },
    receptor: { id: dto.receptor_id },
  });

  await this.registroRepository.save(registro);

  // 🔥 actualizar billetera
  await this.billeteraRepository.increment(
    { usuario: { id: dto.emisor_id } },
    'saldo',
    dto.horas,
  );

  await this.billeteraRepository.increment(
    { usuario: { id: dto.receptor_id } },
    'saldo',
    -dto.horas,
  );

  return registro;
}
}