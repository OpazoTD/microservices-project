import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Productos_Main');
  
  // Creamos la aplicación Nest (instancia HTTP)
  const app = await NestFactory.create(AppModule);

  // Configuración de los puertos (Usando variables de entorno o valores por defecto)
  const HTTP_PORT = process.env.PORT || 3002;
  const TCP_PORT = process.env.MS_TCP_PORT || 3004;

  // Conectamos el Microservicio TCP
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0', // Importante para Docker
      port: Number(TCP_PORT),
    },
  });

  // Iniciamos los microservicios conectados (TCP)
  await app.startAllMicroservices();
  
  // Iniciamos la escucha HTTP
  await app.listen(HTTP_PORT);

  logger.log(`✅ Productos MS: Escuchando comandos TCP en puerto ${TCP_PORT}`);
  logger.log(`🌐 Productos MS: Interfaz HTTP lista en puerto ${HTTP_PORT}`);
}
bootstrap();