import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CarritoService {
  constructor(
    @Inject('PRODUCTOS_SERVICE') private readonly productosClient: ClientProxy,
    @Inject('FACTURAS_SERVICE') private readonly facturasClient: ClientProxy,
  ) {}

  async agregarAlCarrito(usuarioId: string, item: { productoId: number; cantidad: number }) {
    try {
      // 1. Solicitar reserva en productos-ms (TCP Puerto 3004)
      // Esto devuelve un reservaId y asegura el stock por 3 días.
      const reserva = await firstValueFrom(
        this.productosClient.send(
          { cmd: 'reservar_stock' }, 
          { productoId: item.productoId, usuarioId, cantidad: item.cantidad }
        )
      );

      if (!reserva) {
        throw new BadRequestException('No se pudo reservar el producto (Stock insuficiente)');
      }

      // 2. Opcional: Podrías guardar el estado del carrito en una Redis o en usuarios-ms.
      // Si prefieres que facturas-ms maneje el carrito temporal:
      return await firstValueFrom(
        this.facturasClient.send(
          { cmd: 'agregar_item_carrito' }, 
          { ...item, reservaId: reserva.id, usuarioId }
        )
      );
    } catch (error) {
      throw new BadRequestException(error.message || 'Error en la comunicación con los servicios');
    }
  }

  async finalizarCompra(datosCarrito: any) {
    // Este método enviará todo el array de productos a facturas-ms (Puerto 3005)
    // tal como definimos en el procesarCompra de tu AppService anterior.
    return await firstValueFrom(
      this.facturasClient.send({ cmd: 'crear_factura' }, datosCarrito)
    );
  }
}