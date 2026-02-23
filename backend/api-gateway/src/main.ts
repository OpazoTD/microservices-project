import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Prefijo Global: Todas tus rutas empezarán con /api
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('E-commerce API Gateway')
    .setDescription('Punto de entrada único para Microservicios')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Ingrese el token JWT',
      in: 'header',
    }, 'JWT-auth') // Nombre consistente para usar en los controladores
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Cambiamos a /docs para que /api quede libre para los controladores
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
  console.log('🚀 Gateway corriendo en: http://localhost:3000/api');
  console.log('📄 Swagger disponible en: http://localhost:3000/docs');
}
bootstrap();