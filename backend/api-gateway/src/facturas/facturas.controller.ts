import { Controller, Get, Post, Body, UseGuards, Inject, Request } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CompraDto } from './dto/compra.dto'; // Importamos tu DTO

@ApiTags('Facturas')
@Controller('facturas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FacturasController {
  constructor(
    @Inject('FACTURAS_SERVICE') private readonly client: ClientProxy
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva factura/pedido' })
  create(@Request() req, @Body() data: CompraDto) { // Usamos CompraDto aquí
    // El id viene del Token, el resto del Body validado
    const userId = req.user.id; 
    
    // Preparar data en el formato que espera el microservicio
    const facturaData = {
      idUsuario: userId.toString(),
      nombreUser: req.user.nombre,
      emailUser: req.user.email,
      articulos: data.articulos,
      montoTotal: data.articulos.reduce((sum, art) => sum + (art.cantidad * art.precioUnit), 0),
      metodoPago: data.metodoPago,
      direccion: data.direccion
    };
    
    return this.client.send(
      { cmd: 'crear_factura' }, 
      facturaData
    );
  }

  @Get('mis-facturas')
  @ApiOperation({ summary: 'Ver mis facturas' })
  findMyInvoices(@Request() req) {
    const userId = req.user.id.toString().toString();
    return this.client.send({ cmd: 'obtener_facturas_usuario' }, { userId });
  }
}