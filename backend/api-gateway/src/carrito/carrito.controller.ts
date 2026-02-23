import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CarritoService } from './carrito.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Carrito')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  @Post('agregar')
  @ApiOperation({ summary: 'Reserva stock y agrega producto al carrito temporal' })
  async agregarItem(@Request() req, @Body() body: { productoId: number; cantidad: number }) {
    // Extraemos el ID del usuario del token JWT para mayor seguridad
    const usuarioId = req.user.id; 
    
    // Llamamos al servicio que ahora maneja la reserva en productos-ms
    return this.carritoService.agregarAlCarrito(usuarioId, body);
  }

  @Post('comprar')
  @ApiOperation({ summary: 'Finaliza la compra y genera la factura' })
  async finalizarCompra(@Request() req, @Body() carritoData: any) {
    // Este método enviaría todo el contenido del carrito a facturas-ms
    const dataCompleta = { 
      ...carritoData, 
      idUsuario: req.user.id,
      nombreUser: req.user.nombre, // Suponiendo que el JWT tiene el nombre
      emailUser: req.user.email 
    };
    return this.carritoService.finalizarCompra(dataCompleta);
  }
}