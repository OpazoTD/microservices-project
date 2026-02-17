

//   @Post('login')
//   @ApiOperation({ summary: 'Login y obtención de Token JWT' })
//   login(@Body() data: any) {
//     // Aquí llamarás a tu servicio de JWT local
//     return { message: 'Ruta de login pendiente de lógica JWT local' };
//   }

import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  UseGuards, 
  Request, 
  Inject 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('USUARIOS_SERVICE') 
    private readonly usuariosClient: ClientProxy,
    private readonly authService: AuthService,
  ) {}

  // ========================
  // REGISTRO
  // ========================
  @Post('register')
  @ApiOperation({ summary: 'Registro de nuevo usuario' })
  register(
    @Body() body: { nombre: string; email: string; password: string }
  ) {
    return this.usuariosClient.send(
      { cmd: 'crear_usuario' }, 
      body
    );
  }

  // ========================
  // LOGIN
  // ========================
  @Post('login')
  @ApiOperation({ summary: 'Login y obtención de Token JWT' })
  login(
    @Body() body: { email: string; password: string }
  ) {
    return this.authService.login(body);
  }

  // ========================
  // PERFIL (PROTEGIDO)
  // ========================
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  getProfile(@Request() req: any) {
    return req.user;
  }
}
