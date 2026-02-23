import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    // Registro del cliente para comunicarse con Productos MS vía TCP
    ClientsModule.register([
      {
        name: 'PRODUCTOS_SERVICE',
        transport: Transport.TCP,
        options: {
          // Usamos el nombre del servicio definido en docker-compose
          host: process.env.PRODUCTOS_MS_HOST || 'productos-ms',
          port: 3004,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  // Exportamos para que main.ts lo vea sin problemas
  exports: [AppService], 
})
export class AppModule {} // <--- Asegúrate de que este nombre sea exacto