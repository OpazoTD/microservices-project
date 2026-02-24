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

  // ─── Procesar compra y generar factura ───────────────────────────────────────
  async procesarCompra(data: any) {
    try {
      this.logger.log('📋 Procesando nueva factura/orden...');
      this.logger.log('📦 Datos recibidos:', JSON.stringify(data, null, 2));

      // Validar que articulos existe y es un array
      const articulos = data.articulos || data.productos || data.items || [];
      
      if (!Array.isArray(articulos) || articulos.length === 0) {
        this.logger.error('❌ Error: No se recibieron artículos válidos');
        throw new Error('Los artículos son requeridos y deben ser un array');
      }

      // Validar datos de usuario
      if (!data.idUsuario && !data.usuarioId) {
        this.logger.error('❌ Error: No se recibió ID de usuario');
        throw new Error('El ID de usuario es requerido');
      }

      // Confirmar stock en Productos MS
      for (const item of articulos) {
        if (item.reservaId) {
          try {
            await lastValueFrom(
              this.productosClient.send(
                { cmd: 'confirmar_compra' },
                { reservaId: item.reservaId },
              ),
            );
          } catch (error) {
            this.logger.error(`❌ Error al confirmar stock para reserva ${item.reservaId}:`, error);
            throw new Error(`No se pudo confirmar el stock del producto ${item.nombre || item.productoId}`);
          }
        }
      }

      const productos = articulos.map((art: any) => ({
        productoId: art.productoId?.toString() || art.id?.toString(),
        nombre: art.nombre || art.name || 'Sin nombre',
        cantidad: art.cantidad || art.quantity || 1,
        precioUnit: art.precioUnit || art.precio || art.price || 0,
        subtotal: (art.cantidad || art.quantity || 1) * (art.precioUnit || art.precio || art.price || 0),
      }));

      const total = data.montoTotal || data.total || this.calculateTotal(productos);

      this.logger.log('💾 Intentando crear factura en la base de datos...');
      const factura = await this.prisma.factura.create({
        data: {
          usuarioId: data.idUsuario?.toString() || data.usuarioId?.toString(),
          nombreUser: data.nombreUser || data.nombreUsuario || 'Usuario',
          emailUser: data.emailUser || data.emailUsuario || 'usuario@correo.com',
          total,
          productos,
        },
      });

      this.logger.log(`✅ Factura creada exitosamente: ${factura.id}`);
      return factura;
    } catch (error) {
      this.logger.error('❌ Error en procesarCompra:', error);
      this.logger.error('Stack trace:', error.stack);
      throw error;
    }
  }

  // ─── Facturas de un usuario ──────────────────────────────────────────────────
  async findAllByUser(userId: string) {
    return this.prisma.factura.findMany({
      where: { usuarioId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── Stats para el administrador ────────────────────────────────────────────
  async getAdminStats() {
    const [totalFacturas, facturas] = await Promise.all([
      this.prisma.factura.count(),
      this.prisma.factura.findMany({
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const totalRecaudado = facturas.reduce((sum, f) => sum + f.total, 0);

    const totalPedidos = facturas.reduce((sum, f) => {
      return sum + f.productos.reduce((s, p) => s + p.cantidad, 0);
    }, 0);

    // Agrupar por usuario
    const porUsuario = facturas.reduce(
      (acc, f) => {
        if (!acc[f.usuarioId]) {
          acc[f.usuarioId] = {
            usuarioId: f.usuarioId,
            nombreUser: f.nombreUser,
            emailUser: f.emailUser,
            cantidadFacturas: 0,
            totalGastado: 0,
          };
        }
        acc[f.usuarioId].cantidadFacturas++;
        acc[f.usuarioId].totalGastado += f.total;
        return acc;
      },
      {} as Record<string, any>,
    );

    return {
      totalFacturas,
      totalPedidos,
      totalRecaudado: parseFloat(totalRecaudado.toFixed(2)),
      usuariosConFacturas: Object.values(porUsuario),
      ultimasFacturas: facturas.slice(0, 10), // últimas 10
    };
  }

  // ─── Todas las facturas (admin) ──────────────────────────────────────────────
  async getAllFacturas() {
    return this.prisma.factura.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── Agregar item al carrito ─────────────────────────────────────────────────
  async agregarAlCarrito(data: any) {
    this.logger.log(`✅ Item agregado al carrito: ${data.productoId}`);
    return {
      success: true,
      reservaId: data.reservaId,
      productoId: data.productoId,
      cantidad: data.cantidad,
      mensaje: 'Producto reservado y agregado al carrito',
    };
  }

  private calculateTotal(items: any[]): number {
    if (!Array.isArray(items)) return 0;
    return items.reduce(
      (total, item) => total + (item.precioUnit || item.precio || item.price || 0) * (item.cantidad || item.quantity || 1),
      0,
    );
  }
}