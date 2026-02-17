import { Controller, Get, Post, Body, Param, UseGuards, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Productos')
@Controller('productos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductosController {
  constructor(
    @Inject('PRODUCTOS_SERVICE')
    private readonly productosClient: ClientProxy,
  ) {}

  @Get()
  findAll() {
    return this.productosClient.send('find_all_productos', {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productosClient.send('find_one_producto', { id: +id });
  }

  @Post()
  create(@Body() createProductoDto: any) {
    return this.productosClient.send('create_producto', createProductoDto);
  }
}
