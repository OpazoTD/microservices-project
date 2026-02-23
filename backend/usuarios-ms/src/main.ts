import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 3001,
    },
  });
   process.on('unhandledRejection', (reason) => {
     console.error('Unhandled rejection:', reason);
   });
  await app.listen();
  console.log('🚀 Microservicio de Usuarios escuchando en el puerto 3001 (TCP)');
}
bootstrap();