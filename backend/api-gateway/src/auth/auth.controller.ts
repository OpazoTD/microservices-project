import { 
  Controller, Post, Body, Get, UseGuards, Request, Inject, HttpStatus 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

// CAMBIO AQUÍ: Importación local desde la carpeta que creamos
import { IniciarSesionDto } from './dto/iniciar-sesion.dto';
// Nota: RegistrarUsuarioDto suele estar en el módulo de usuarios, 
// pero si lo necesitas aquí, asegúrate de que el archivo exista en auth/dto/
import { RegistrarUsuarioDto } from '../usuarios/dto/registrar-usuario.dto'; 

@ApiTags('🔐 Autenticación')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('USUARIOS_SERVICE') private readonly usuariosClient: ClientProxy,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Registro de nuevo usuario' })
  async register(@Body() dto: RegistrarUsuarioDto) {
    return this.usuariosClient.send({ cmd: 'crear_usuario' }, dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login y obtención de Token JWT' })
  async login(@Body() dto: IniciarSesionDto) {
    // El servicio authService se encarga de generar el JWT
    return this.authService.login(dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getProfile(@Request() req: any) {
    return req.user;
  }
}