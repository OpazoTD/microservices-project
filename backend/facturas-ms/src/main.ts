import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Facturas_Main');

  try {
    // Convertimos a número de forma segura para TypeScript
    const tcpPort = process.env.TCP_PORT ? parseInt(process.env.TCP_PORT, 10) : 3003;

    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0', 
        port: tcpPort, 
      },
    });

    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled rejection:', reason);
    });

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught exception:', error);
    });

    await app.listen();
    logger.log(`📑 Facturas MS: Escuchando vía TCP en puerto ${tcpPort}`);
  } catch (error) {
    logger.error('❌ Error crítico al iniciar el servicio:', error);
    process.exit(1);
  }
}
bootstrap();