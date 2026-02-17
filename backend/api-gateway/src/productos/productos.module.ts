import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductosController } from './productos.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCTOS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.PRODUCTOS_MS_HOST || 'localhost',
          port: Number(process.env.PRODUCTOS_MS_PORT) || 3002,
        },
      },
    ]),
  ],
  controllers: [ProductosController],
})
export class ProductosModule {}