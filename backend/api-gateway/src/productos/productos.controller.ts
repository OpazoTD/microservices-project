import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Productos')
@Controller('productos')
export class ProductosController {
  constructor(
    @Inject('PRODUCTOS_SERVICE') private readonly client: ClientProxy
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  findAll() {
    return this.client.send({ cmd: 'obtener_productos' }, {});
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener producto por ID' })
  findOne(@Param('id') id: string) {
    // IMPORTANTE: Convertir a número si tu DB usa IDs numéricos
    return this.client.send({ cmd: 'buscar_producto_id' }, Number(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'vendedor', 'ADMIN', 'VENDEDOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear nuevo producto' })
  create(@Body() data: any) {
    return this.client.send({ cmd: 'crear_producto' }, data);
  }
}