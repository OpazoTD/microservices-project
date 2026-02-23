import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  
  // Opcional: Personalizar la respuesta de error
  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException('Acceso denegado: Token inválido o inexistente');
    }
    return user;
  }

  // Opcional: Agregar lógica antes/después de la validación
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Aquí podrías, por ejemplo, verificar si el sistema está en mantenimiento
    const result = (await super.canActivate(context)) as boolean;
    
    // Si llegó aquí, Passport ya asignó el usuario al request
    // gracias a lo que definiste en el método validate() de tu estrategia
    return result;
  }
}