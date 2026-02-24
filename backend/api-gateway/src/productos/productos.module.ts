import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductosController } from './productos.controller';

@Module({
  imports: [
    ConfigModule,
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
    ]),
  ],
  controllers: [ProductosController],
})
export class ProductosModule {}