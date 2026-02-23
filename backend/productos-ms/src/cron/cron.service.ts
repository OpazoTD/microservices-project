import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Reserva, EstadoReserva } from '../productos/reserva.entity';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepo: Repository<Reserva>,
  ) {}

  /**
   * Se ejecuta automáticamente cada hora para liberar stock bloqueado
   * por reservas que nunca se convirtieron en compra.
   */
  @Cron(CronExpression.EVERY_HOUR)
  async limpiarReservasExpiradas() {
    this.logger.log('Iniciando proceso de limpieza de reservas expiradas...');

    try {
      const ahora = new Date();

      // Buscamos reservas PENDIENTES cuya fecha de expiración ya pasó
      const resultado = await this.reservaRepo.update(
        {
          estado: EstadoReserva.PENDIENTE,
          expiresAt: LessThan(ahora),
        },
        {
          estado: EstadoReserva.EXPIRADA,
        },
      );

      // ARREGLO TS(18048): Usamos el operador ?? para asegurar un valor numérico
      const totalAfectados = resultado?.affected ?? 0;

      if (totalAfectados > 0) {
        this.logger.log(`✅ Éxito: Se han marcado ${totalAfectados} reservas como EXPIRADAS.`);
      } else {
        this.logger.log('ℹ️ No se encontraron reservas pendientes de expiración en este ciclo.');
      }
    } catch (error) {
      this.logger.error('❌ Error al intentar limpiar las reservas expiradas:', error.message);
    }
  }
}