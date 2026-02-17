import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Inject,
  Request,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ForbiddenException } from '@nestjs/common';

@ApiTags('Usuarios')
@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsuariosController {
  constructor(
    @Inject('USUARIOS_SERVICE')
    private readonly usuariosClient: ClientProxy,
  ) {}

  // SOLO ADMIN puede crear usuarios manualmente
  @Post()
  @Roles('admin')
  create(@Body() createUsuarioDto: any) {
    return this.usuariosClient.send('create_usuario', createUsuarioDto);
  }

  // SOLO ADMIN puede ver todos los usuarios
  @Get()
  @Roles('admin')
  findAll() {
    return this.usuariosClient.send('find_all_usuarios', {});
  }

  // Usuario puede ver su perfil
  // Admin puede ver cualquiera
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    const isAdmin = req.user.role === 'admin';
    const isOwner = req.user.sub === +id;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('No autorizado');
    }

    return this.usuariosClient.send('find_one_usuario', { id: +id });
  }
}
