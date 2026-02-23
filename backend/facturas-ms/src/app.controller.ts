import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'crear_factura' })
  async crearFactura(@Payload() data: any) {
    // Recibe la data del Gateway y la pasa al Service
    return this.appService.procesarCompra(data);
  }

  @MessagePattern({ cmd: 'obtener_facturas_usuario' })
  async getByUser(@Payload() data: { userId: string }) {
    return this.appService.findAllByUser(data.userId);
  }

  @MessagePattern({ cmd: 'agregar_item_carrito' })
  async agregarAlCarrito(@Payload() data: any) {
    // Guarda el item del carrito temporalmente
    return this.appService.agregarAlCarrito(data);
  }

  @MessagePattern({ cmd: 'get_user_invoices' })
  async getUserInvoices(@Payload() userId: string) {
    return this.appService.findAllByUser(userId);
  }
}