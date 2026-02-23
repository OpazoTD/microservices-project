import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CarritoController } from './carrito.controller';
import { CarritoService } from './carrito.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'PRODUCTOS_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>('MS_PRODUCT_HOST', 'productos-ms'),
            port: config.get<number>('MS_PRODUCT_PORT', 3004),
          },
        }),
      },
      {
        name: 'FACTURAS_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>('MS_INVOICE_HOST', 'facturas-ms'),
            port: config.get<number>('MS_INVOICE_PORT', 3003),
          },
        }),
      },
    ]),
  ],
  controllers: [CarritoController],
  providers: [CarritoService],
})
export class CarritoModule {}