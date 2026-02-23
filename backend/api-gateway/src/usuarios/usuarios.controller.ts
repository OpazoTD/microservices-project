import { Controller, Get, Post, Put, Body, Param, UseGuards, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Usuarios')
@Controller('usuarios')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsuariosController {
  constructor(
    @Inject('USUARIOS_SERVICE') private readonly client: ClientProxy
  ) {}

  @Post('registrar')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  async registrar(@Body() data: any) {
    return this.client.send({ cmd: 'crear_usuario' }, data);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'ADMIN')
  @ApiBearerAuth()
  findAll() {
    return this.client.send({ cmd: 'obtener_usuarios' }, {});
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.client.send({ cmd: 'buscar_por_id' }, Number(id));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() data: any) {
    return this.client.send({ cmd: 'actualizar_perfil' }, { 
      id: Number(id), 
      datos: data 
    });
  }
}