import { Controller, Get, Post, Body, Param, UseGuards, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Facturas')
@Controller('facturas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FacturasController {
  constructor(
    @Inject('FACTURAS_SERVICE')
    private readonly facturasClient: ClientProxy,
  ) {}

  @Get()
  findAll() {
    return this.facturasClient.send('find_all_facturas', {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.facturasClient.send('find_one_factura', { id: +id });
  }

  @Get('usuario/:id')
  findByUsuario(@Param('id') id: string) {
    return this.facturasClient.send('find_facturas_by_usuario', { usuarioId: +id });
  }
}
