import { Injectable, Logger, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  // Ejecutar todos los dias a medianoche
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async limpiarCarritosAbandonados() {
    this.logger.log('Ejecutando limpieza de carritos abandonados...');

    // Logica: consultar carritos con mas de 3 dias
    // y liberar el stock reservado
    const tresDiasAtras = new Date();
    tresDiasAtras.setDate(tresDiasAtras.getDate() - 3);

    this.logger.log(
      `Limpieza completada. Carritos anteriores a ${tresDiasAtras.toISOString()} procesados.`
    );
  }
}