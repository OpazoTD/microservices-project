import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { Producto } from './producto.entity';
import { Reserva } from './reserva.entity'; // Asegúrate de que la ruta sea correcta
@Module({
  imports: [TypeOrmModule.forFeature([Producto, Reserva])], // Agregamos Reserva aquí
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}