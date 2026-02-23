import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ProductosModule } from './productos/productos.module';
import { CronService } from './cron/cron.service';
import { Producto } from './productos/producto.entity';
import { Reserva } from './productos/reserva.entity';

@Module({
  imports: [
    // 1. Habilitamos los Cron Jobs (tareas programadas)
    ScheduleModule.forRoot(),

    // 2. Configuración unificada de Base de Datos
    TypeOrmModule.forRoot({
      type: 'mysql',
      // Prioriza variables de entorno para Docker, usa 'mysql' o 'localhost' como fallback
      host: process.env.DB_HOST || 'mysql', 
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'admin',
      password: process.env.DB_PASSWORD || 'admin123',
      database: process.env.DB_DATABASE || 'productos_db',
      // Es VITAL incluir ambas entidades para que TypeORM las reconozca
      entities: [Producto, Reserva], 
      synchronize: true, // Sincroniza el schema automáticamente en desarrollo
      retryAttempts: 10,
      retryDelay: 5000,
    }),

    // 3. Inyectamos el Repositorio de Reserva para que el CronService pueda usarlo
    TypeOrmModule.forFeature([Reserva]),

    // 4. Cargamos el módulo de lógica de productos
    ProductosModule,
  ],
  // 5. Registramos el CronService como proveedor global del módulo
  providers: [CronService],
})
export class AppModule {}