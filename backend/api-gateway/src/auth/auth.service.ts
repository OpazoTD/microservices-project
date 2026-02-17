import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USUARIOS_SERVICE') private readonly usuariosClient: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: any) {
    const { email, password } = loginDto;

    // Enviamos las credenciales al microservicio de usuarios para validarlas
    // Usamos firstValueFrom porque .send() devuelve un Observable y queremos una Promesa
    const user = await firstValueFrom(
      this.usuariosClient.send({ cmd: 'validar_usuario' }, { email, password })
    );

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Si el usuario es válido, firmamos el token
    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre
      }
    };
  }

  async validarToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      return null;
    }
  }
}