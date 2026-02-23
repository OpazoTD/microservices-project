import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductosService } from './productos.service';

@Controller()
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @MessagePattern({ cmd: 'obtener_productos' })
  findAll() {
    return this.productosService.findAll();
  }

  @MessagePattern({ cmd: 'buscar_producto_id' })
  findOne(@Payload() id: number) {
    return this.productosService.findOne(id);
  }

  @MessagePattern({ cmd: 'crear_producto' })
  create(@Payload() data: any) {
    // Aquí recibes el objeto del producto
    return this.productosService.create(data);
  }

  @MessagePattern({ cmd: 'reservar_stock' })
  reservarStock(@Payload() data: { productoId: number; usuarioId: number; cantidad: number }) {
    return this.productosService.reservarStock(data.productoId, data.usuarioId, data.cantidad);
  }

  @MessagePattern({ cmd: 'confirmar_compra' })
  confirmarCompra(@Payload() data: { reservaId: number }) {
    return this.productosService.confirmarCompra(data.reservaId);
  }
}