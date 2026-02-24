import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaClient, Rol } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from './prisma.service';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { nombre: string; email: string; password: string; rol?: Rol }) {
    const normalizedEmail = String(data.email).trim().toLowerCase();

    const existe = await this.prisma.usuario.findUnique({ where: { email: normalizedEmail } });
    if (existe) throw new ConflictException('El email ya está registrado');

    const hashed = await bcrypt.hash(data.password, 10);

    return this.prisma.usuario.create({
      data: {
        nombre: data.nombre,
        email: normalizedEmail,
        password: hashed,
        rol: data.rol ?? Rol.USER, 
        cart: { create: {} },
      },
      select: { id: true, nombre: true, email: true, rol: true },
    });
  }
  async validar(email: string, password: string) {
  const normalizedEmail = String(email).trim().toLowerCase();

  const usuario = await this.prisma.usuario.findUnique({ where: { email: normalizedEmail } });
  if (!usuario) return null;

  // Verificar si el usuario está activo
  if (!usuario.activo) return null;

  const valido = await bcrypt.compare(password, usuario.password);
  if (!valido) return null;

  return {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    role: usuario.rol,
    activo: usuario.activo,
  };
}
  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }

  async findByEmail(email: string) {
    return this.prisma.usuario.findUnique({ where: { email } });
  }

  async findAll() {
    return this.prisma.usuario.findMany({
      select: { id: true, nombre: true, email: true, rol: true, activo: true, createdAt: true, updatedAt: true },
    });
  }

  async update(id: number, data: any) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    // Si se está actualizando la contraseña, hashearla
    if (data.clave || data.password) {
      const passwordToHash = data.clave || data.password;
      data.password = await bcrypt.hash(passwordToHash, 10);
      delete data.clave;
    }

    // Si se está actualizando el email, normalizarlo
    if (data.email) {
      data.email = String(data.email).trim().toLowerCase();
      
      // Verificar que no exista otro usuario con ese email
      const existente = await this.prisma.usuario.findUnique({ where: { email: data.email } });
      if (existente && existente.id !== id) {
        throw new ConflictException('El email ya está registrado');
      }
    }

    return this.prisma.usuario.update({
      where: { id },
      data,
      select: { id: true, nombre: true, email: true, rol: true, activo: true, createdAt: true, updatedAt: true },
    });
  }

  async updateEstado(id: number, activo: boolean) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    return this.prisma.usuario.update({
      where: { id },
      data: { activo },
      select: { id: true, nombre: true, email: true, rol: true, activo: true, createdAt: true, updatedAt: true },
    });
  }
}