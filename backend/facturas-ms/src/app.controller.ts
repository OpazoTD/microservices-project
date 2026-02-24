import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // ─── Usuario: crear factura al comprar ───────────────────────────────────────
  @MessagePattern({ cmd: 'crear_factura' })
  async crearFactura(@Payload() data: any) {
    return this.appService.procesarCompra(data);
  }

  // ─── Usuario: ver sus propias facturas ───────────────────────────────────────
  @MessagePattern({ cmd: 'obtener_facturas_usuario' })
  async getByUser(@Payload() data: { userId: string }) {
    return this.appService.findAllByUser(data.userId);
  }

  @MessagePattern({ cmd: 'get_user_invoices' })
  async getUserInvoices(@Payload() userId: string) {
    return this.appService.findAllByUser(userId);
  }

  // ─── Usuario: agregar al carrito ────────────────────────────────────────────
  @MessagePattern({ cmd: 'agregar_item_carrito' })
  async agregarAlCarrito(@Payload() data: any) {
    return this.appService.agregarAlCarrito(data);
  }

  // ─── Admin: estadísticas generales ──────────────────────────────────────────
  @MessagePattern({ cmd: 'admin_get_stats' })
  async getAdminStats() {
    return this.appService.getAdminStats();
  }

  // ─── Admin: todas las facturas ───────────────────────────────────────────────
  @MessagePattern({ cmd: 'admin_get_all_facturas' })
  async getAllFacturas() {
    return this.appService.getAllFacturas();
  }
}