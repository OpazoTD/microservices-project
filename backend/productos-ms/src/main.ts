import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Definimos puertos distintos para que no choquen
  const httpPort = 3002; 
  const tcpPort = 3004; // <-- Cambiado de 3002 a 3004

  // Configuración del Microservicio (TCP)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: tcpPort,
    },
  });

  await app.startAllMicroservices();
  
  // Iniciar el servidor HTTP (Vital para el Gateway y Docker)
  await app.listen(httpPort, '0.0.0.0');

  console.log(`🚀 Productos MS: HTTP en ${httpPort} | TCP en ${tcpPort}`);
}
bootstrap();