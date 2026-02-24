import { Controller, Get, Post, Put, Patch, Body, Param, ParseIntPipe, UseGuards, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import { ActualizarEstadoUsuarioDto } from './dto/actualizar-estado-usuario.dto';

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
  @ApiOperation({ summary: 'Obtener lista de todos los usuarios (solo ADMIN)' })
  findAll() {
    return this.client.send({ cmd: 'obtener_usuarios' }, {});
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'buscar_por_id' }, id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar usuario (solo ADMIN)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() data: ActualizarUsuarioDto) {
    return this.client.send({ cmd: 'actualizar_perfil' }, { 
      id, 
      datos: data 
    });
  }

  @Patch(':id/estado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Habilitar o inhabilitar usuario (solo ADMIN)' })
  updateEstado(@Param('id', ParseIntPipe) id: number, @Body() dto: ActualizarEstadoUsuarioDto) {
    return this.client.send({ cmd: 'actualizar_estado' }, { 
      id, 
      activo: dto.activo 
    });
  }
}