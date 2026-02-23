import { Injectable, Inject, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom, timeout, catchError, throwError } from 'rxjs';
import { IniciarSesionDto } from './dto/iniciar-sesion.dto';
@Injectable()
export class AuthService {
  constructor(
    @Inject('USUARIOS_SERVICE') private readonly usuariosClient: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: IniciarSesionDto) {
    // 1. Validar existencia y credenciales en el MS de Usuarios
    const user = await firstValueFrom(
      this.usuariosClient.send({ cmd: 'validar_usuario' }, dto).pipe(
        timeout(5000), // Evita que el Gateway se quede colgado si el MS no responde
        catchError(err => throwError(() => new InternalServerErrorException('Error de comunicación con Usuarios')))
      )
    );

    if (!user) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    // 2. Generar Payload (Estandarizado)
    const payload = { 
      sub: user.id, 
      email: user.email, 
      nombre: user.nombre,
      role: user.role 
    };

    // 3. Respuesta limpia y estructurada
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role
      }
    };
  }
}