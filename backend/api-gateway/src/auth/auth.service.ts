import { Injectable, Inject, UnauthorizedException, InternalServerErrorException, BadRequestException, ConflictException } from '@nestjs/common';
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
    const normalizedEmail = String(dto?.email ?? '').trim().toLowerCase();
    const normalizedPassword = String((dto as any)?.clave ?? (dto as any)?.password ?? '').trim();

    // 1. Validar existencia y credenciales en el MS de Usuarios
    const user = await firstValueFrom(
      this.usuariosClient.send({ cmd: 'validar_usuario' }, { email: normalizedEmail, clave: normalizedPassword }).pipe(
        timeout(5000), // Evita que el Gateway se quede colgado si el MS no responde
        catchError(err => throwError(() => new InternalServerErrorException('Error de comunicación con Usuarios')))
      )
    );

    if (!user) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    const resolvedRole = String((user.role ?? user.rol ?? 'USER')).toUpperCase();

    // 2. Generar Payload (Estandarizado)
    const payload = { 
      sub: user.id, 
      email: user.email, 
      nombre: user.nombre,
      role: resolvedRole,
    };

    // 3. Respuesta limpia y estructurada
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: resolvedRole,
      }
    };
  }

  async register(dto: { nombre: string; email: string; clave: string }) {
    const normalizedEmail = String(dto?.email ?? '').trim().toLowerCase();
    const normalizedPassword = String((dto as any)?.clave ?? (dto as any)?.password ?? '').trim();

    const createdUser = await firstValueFrom(
      this.usuariosClient.send(
        { cmd: 'crear_usuario' },
        { nombre: dto.nombre, email: normalizedEmail, clave: normalizedPassword },
      ).pipe(
        timeout(5000),
        catchError(() => throwError(() => new InternalServerErrorException('Error de comunicación con Usuarios'))),
      ),
    );

    if (createdUser?.status === 'error') {
      const message = createdUser?.message || 'No se pudo registrar el usuario';
      if (String(message).toLowerCase().includes('ya está registrado')) {
        throw new ConflictException(message);
      }
      throw new BadRequestException(message);
    }

    const resolvedRole = String((createdUser?.role ?? createdUser?.rol ?? 'USER')).toUpperCase();

    const payload = {
      sub: createdUser.id,
      email: createdUser.email,
      nombre: createdUser.nombre,
      role: resolvedRole,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: createdUser.id,
        nombre: createdUser.nombre,
        email: createdUser.email,
        role: resolvedRole,
      },
    };
  }

  async updateProfile(userId: number, dto: { nombre?: string; email?: string; clave?: string }) {
    const updateData: any = {};
    
    if (dto.nombre) {
      updateData.nombre = dto.nombre;
    }
    
    if (dto.email) {
      updateData.email = String(dto.email).trim().toLowerCase();
    }
    
    if (dto.clave) {
      updateData.clave = dto.clave;
    }

    const updatedUser = await firstValueFrom(
      this.usuariosClient.send(
        { cmd: 'actualizar_perfil' },
        { id: userId, datos: updateData }
      ).pipe(
        timeout(5000),
        catchError(() => throwError(() => new InternalServerErrorException('Error al actualizar perfil')))
      )
    );

    if (updatedUser?.status === 'error') {
      const message = updatedUser?.message || 'No se pudo actualizar el perfil';
      if (String(message).toLowerCase().includes('ya está registrado') || 
          String(message).toLowerCase().includes('duplicado')) {
        throw new ConflictException('El email ya está en uso por otro usuario');
      }
      throw new BadRequestException(message);
    }

    return {
      message: 'Perfil actualizado correctamente',
      user: {
        id: updatedUser.id,
        nombre: updatedUser.nombre,
        email: updatedUser.email,
        rol: updatedUser.rol,
        activo: updatedUser.activo,
      }
    };
  }
}