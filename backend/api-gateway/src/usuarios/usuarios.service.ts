import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ServicioUsuarios {
  constructor(
    // Usamos el nombre que definiste en el UsuariosModule
    @Inject('USUARIOS_SERVICE') private readonly usuariosClient: ClientProxy,
  ) {}

  async obtenerPerfil(id: number) {
    try {
      const usuario = await firstValueFrom(
        this.usuariosClient.send({ cmd: 'obtener_usuario_por_id' }, { id })
      );
      
      if (!usuario) return null;

      // Limpieza de seguridad: nunca enviar la clave al cliente final
      const { clave, password, ...sinPrivados } = usuario;
      return sinPrivados;
    } catch (error) {
      throw error;
    }
  }

  async actualizar(id: number, dto: any) {
    // Delega la lógica de actualización al microservicio
    return await firstValueFrom(
      this.usuariosClient.send({ cmd: 'actualizar_usuario' }, { id, dto })
    );
  }

  async cambiarClave(id: number, claveActual: string, claveNueva: string) {
    // Esta lógica es mejor tenerla aquí para evitar peticiones innecesarias
    // si el microservicio de usuarios es muy pesado.
    const validacion = await firstValueFrom(
      this.usuariosClient.send({ cmd: 'verificar_clave' }, { id, clave: claveActual })
    );

    if (!validacion.valida) {
      throw new UnauthorizedException('La contraseña actual no coincide');
    }

    return await firstValueFrom(
      this.usuariosClient.send({ cmd: 'cambiar_clave' }, { id, claveNueva })
    );
  }
}