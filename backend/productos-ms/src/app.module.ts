import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ProductosModule } from './productos/productos.module';
// ReservasModule and CronModule removed: not present in this microservice
import { Producto } from './productos/producto.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'mysql',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'admin',
      password: process.env.DB_PASSWORD || 'admin123',
      database: process.env.DB_DATABASE || 'productos_db',
      entities: [Producto],
      synchronize: true, // Solo en desarrollo
      retryAttempts: 10,
      retryDelay: 5000,
    }),
    ScheduleModule.forRoot(),
    ProductosModule,
    // ReservasModule and CronModule intentionally omitted
  ],
})
export class AppModule {}