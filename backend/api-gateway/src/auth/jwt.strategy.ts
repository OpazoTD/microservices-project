import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'mi_super_secreto_jwt_2024',
    });
  }

  async validate(payload: { sub: number; email: string; rol: string }) {
    // Este objeto se inyecta en request.user
    return {
      userId: payload.sub,
      email: payload.email,
      rol: payload.rol,
    };
  }
}