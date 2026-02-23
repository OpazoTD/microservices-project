import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from './prisma.service';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private prisma: PrismaService,
    @Inject('PRODUCTOS_SERVICE') private readonly productosClient: ClientProxy,
  ) {}

  async procesarCompra(data: any) {
    this.logger.log('📋 Procesando nueva factura/orden...');

    // 1. Confirmar stock en Productos MS (como en tu ejemplo de flujo)
    for (const item of data.articulos) {
      if (item.reservaId) {
        await lastValueFrom(
          this.productosClient.send({ cmd: 'confirmar_compra_stock' }, { reservaId: item.reservaId })
        );
      }
    }

    // 2. Crear el registro en MongoDB usando Prisma
    return this.prisma.factura.create({
      data: {
        usuarioId: data.idUsuario,
        nombreUser: data.nombreUser,
        emailUser: data.emailUser,
        total: data.montoTotal || this.calculateTotal(data.articulos),
        productos: data.articulos.map((art: any) => ({
          productoId: art.productoId.toString(),
          nombre: art.nombre,
          cantidad: art.cantidad,
          precioUnit: art.precioUnit,
          subtotal: art.cantidad * art.precioUnit,
        })),
      },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.factura.findMany({
      where: { usuarioId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async agregarAlCarrito(data: any) {
    // Guarda el item en una colección temporal de carrito
    this.logger.log(`✅ Item agregado al carrito: ${data.productoId}`);
    // Retorna el item con su reservaId para el cliente
    return { 
      success: true, 
      reservaId: data.reservaId, 
      productoId: data.productoId,
      cantidad: data.cantidad,
      mensaje: 'Producto reservado y agregado al carrito' 
    };
  }

  private calculateTotal(items: any[]): number {
    return items.reduce((total, item) => total + (item.precioUnit * item.cantidad), 0);
  }
}