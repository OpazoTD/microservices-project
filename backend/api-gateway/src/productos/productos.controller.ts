import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ProductoDto } from './dto/producto.dto';
import { ActualizarProductoDto } from './dto/actualizar-producto.dto';

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
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear nuevo producto (solo ADMIN)' })
  create(@Body() data: ProductoDto) {
    return this.client.send({ cmd: 'crear_producto' }, data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar producto (solo ADMIN)' })
  update(@Param('id') id: string, @Body() data: ActualizarProductoDto) {
    return this.client.send(
      { cmd: 'actualizar_producto' },
      { id: Number(id), ...data }
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar producto (solo ADMIN)' })
  delete(@Param('id') id: string) {
    return this.client.send({ cmd: 'eliminar_producto' }, Number(id));
  }
}