import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Obtener los roles requeridos desde el decorador @Roles
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si no hay roles definidos en la ruta, permitimos el acceso
    if (!requiredRoles) {
      return true;
    }

    // 2. Obtener el usuario del request (inyectado por JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest();

    // SEGURIDAD: Si no hay usuario, significa que olvidaste poner @UseGuards(JwtAuthGuard)
    if (!user) {
      throw new UnauthorizedException('No se encontró información del usuario. ¿Olvidaste el JwtAuthGuard?');
    }

    // 3. Verificar si el usuario tiene el rol necesario
    // Nota: Asegúrate de usar 'user.role' o 'user.rol' según definiste en tu JwtStrategy
    const userRoleRaw = String(user.role || user.rol || '').trim();
    const normalizedUserRole = userRoleRaw.toLowerCase();

    const normalizedRequiredRoles = requiredRoles.map((role) =>
      String(role).trim().toLowerCase(),
    );

    const roleAliases: Record<string, string[]> = {
      admin: ['administrator'],
      vendedor: ['seller'],
      user: ['cliente', 'usuario'],
    };

    const expandedRequiredRoles = new Set<string>();
    for (const role of normalizedRequiredRoles) {
      expandedRequiredRoles.add(role);
      const aliases = roleAliases[role] || [];
      for (const alias of aliases) {
        expandedRequiredRoles.add(alias);
      }
    }

    const hasRole = expandedRequiredRoles.has(normalizedUserRole);

    if (!hasRole) {
      throw new ForbiddenException(
        `Tu rol (${user.role || user.rol}) no tiene permisos para acceder a este recurso`
      );
    }

    return true;
  }
}