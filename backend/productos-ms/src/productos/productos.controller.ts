import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductosService } from './productos.service';

@Controller()
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @MessagePattern('create_producto')
  create(@Payload() data: any) {
    return this.productosService.create(data);
  }

  @MessagePattern('find_all_productos')
  findAll() {
    return this.productosService.findAll();
  }

  @MessagePattern('find_one_producto')
  findOne(@Payload() data: { id: number }) {
    return this.productosService.findOne(data.id);
  }

  @MessagePattern('reservar_stock')
  reservar(@Payload() data: { productoId: number; cantidad: number }) {
    return this.productosService.reservarStock(data.productoId, data.cantidad);
  }

  @MessagePattern('confirmar_compra_stock')
  confirmar(@Payload() data: { productoId: number; cantidad: number }) {
    return this.productosService.confirmarCompra(data.productoId, data.cantidad);
  }

  @MessagePattern('liberar_reserva')
  liberar(@Payload() data: { productoId: number; cantidad: number }) {
    return this.productosService.liberarReserva(data.productoId, data.cantidad);
  }
}
