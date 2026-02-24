import { Controller, Get, Post, Body, UseGuards, Inject, Request, BadRequestException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CompraDto } from './dto/compra.dto'; // Importamos tu DTO

@ApiTags('Facturas')
@Controller('facturas')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class FacturasController {
  constructor(
    @Inject('FACTURAS_SERVICE') private readonly client: ClientProxy
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva factura/pedido' })
  create(@Request() req, @Body() data: CompraDto | any) {
    const userId = req.user.id;
    const nombreUser = data?.nombreUser ?? req.user.nombre;
    const emailUser = data?.emailUser ?? req.user.email;
    const rawArticulos = Array.isArray(data?.articulos)
      ? data.articulos
      : Array.isArray(data?.productos)
        ? data.productos.map((item: any) => ({
            productoId: item.productoId,
            nombre: item.nombre,
            cantidad: item.cantidad,
            precioUnit: item.precioUnit,
            reservaId: item.reservaId,
          }))
        : null;

    if (!rawArticulos) {
      throw new BadRequestException('El payload debe incluir articulos o productos');
    }

    const montoTotal = data?.montoTotal ?? data?.total ?? rawArticulos.reduce(
      (sum: number, art: any) => sum + (Number(art.cantidad) * Number(art.precioUnit)),
      0,
    );

    const facturaData = {
      idUsuario: String(data?.idUsuario ?? data?.usuarioId ?? userId),
      nombreUser,
      emailUser,
      articulos: rawArticulos,
      montoTotal,
      metodoPago: data?.metodoPago ?? 'N/A',
      direccion: data?.direccion ?? 'N/A',
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

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Obtener todas las facturas (solo ADMIN)' })
  findAll() {
    return this.client.send({ cmd: 'admin_get_all_facturas' }, {});
  }
}