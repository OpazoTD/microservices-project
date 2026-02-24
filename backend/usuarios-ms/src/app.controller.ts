import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsuariosService } from './app.service'; 

@Controller()
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @MessagePattern({ cmd: 'crear_usuario' })
  async registrar(@Payload() data: any) {
    try {
      return await this.usuariosService.create({
        nombre: data.nombre,
        email: data.email,
        password: data.clave || data.password, 
      });
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  @MessagePattern({ cmd: 'validar_usuario' })
    async validar(@Payload() data: any) {
      return this.usuariosService.validar(data.email, data.clave || data.password);
    }
    
  @MessagePattern({ cmd: 'buscar_por_id' })
  async buscarPorId(@Payload() id: number) {
    return this.usuariosService.findOne(id);
  }

  @MessagePattern({ cmd: 'buscar_por_email' })
  async buscarPorEmail(@Payload() email: string) {
    return this.usuariosService.findByEmail(email);
  }

  @MessagePattern({ cmd: 'obtener_usuarios' })
  async listarTodos() {
    return this.usuariosService.findAll();
  }

  @MessagePattern({ cmd: 'actualizar_perfil' })
  async actualizar(@Payload() data: { id: number, datos: any }) {
    return this.usuariosService.update(data.id, data.datos);
  }

  @MessagePattern({ cmd: 'actualizar_estado' })
  async actualizarEstado(@Payload() data: { id: number, activo: boolean }) {
    return this.usuariosService.updateEstado(data.id, data.activo);
  }
}