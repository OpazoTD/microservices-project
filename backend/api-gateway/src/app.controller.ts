import { Controller, Get, Post, Body, Param, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Usuarios') // Esto lo agrupa en Swagger
@Controller('usuarios')
export class UsuariosController {
  constructor(
    @Inject('USUARIOS_SERVICE') private readonly usuariosClient: ClientProxy,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  crearUsuario(@Body() crearUsuarioDto: any) {
    // .send(patron, datos) envía la petición al microservicio vía TCP
    return this.usuariosClient.send({ cmd: 'crear_usuario' }, crearUsuarioDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  obtenerUsuario(@Param('id') id: string) {
    return this.usuariosClient.send({ cmd: 'obtener_usuario' }, id);
  }
}