import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FacturasController } from './facturas.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'FACTURAS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.MS_INVOICE_HOST || 'facturas-ms',
          port: Number(process.env.MS_INVOICE_PORT) || 3003,
        },
      },
    ]),
  ],
  controllers: [FacturasController],
})
export class FacturasModule {}