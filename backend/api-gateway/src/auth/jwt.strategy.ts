import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

// Definimos la estructura del payload para evitar errores de dedo
interface JwtPayload {
  sub: number;
  email: string;
  role: string;
  nombre?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');

    // Validación preventiva: Si no hay secreto, la aplicación debe fallar al arrancar
    if (!secret) {
      throw new Error('JWT_SECRET no encontrado en las variables de entorno');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret, // Ahora TypeScript sabe que 'secret' es string
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.sub) {
      throw new UnauthorizedException('Token no contiene información de usuario válida');
    }

    return {
      id: payload.sub,
      email: payload.email,
      nombre: payload.nombre,
      role: payload.role,
    };
  }
}