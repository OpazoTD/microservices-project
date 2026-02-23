import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaClient, Rol } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from './prisma.service';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { nombre: string; email: string; password: string; rol?: Rol }) {
    const existe = await this.prisma.usuario.findUnique({ where: { email: data.email } });
    if (existe) throw new ConflictException('El email ya está registrado');

    const hashed = await bcrypt.hash(data.password, 10);

    return this.prisma.usuario.create({
      data: {
        nombre: data.nombre,
        email: data.email,
        password: hashed,
        rol: data.rol ?? Rol.USER, 
        cart: { create: {} },
      },
      select: { id: true, nombre: true, email: true, rol: true },
    });
  }
  async validar(email: string, password: string) {
  const usuario = await this.prisma.usuario.findUnique({ where: { email } });
  if (!usuario) return null;

  const valido = await bcrypt.compare(password, usuario.password);
  if (!valido) return null;

  return {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    role: usuario.rol,
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
      select: { id: true, nombre: true, email: true, rol: true },
    });
  }

  async update(id: number, data: any) {
    return this.prisma.usuario.update({
      where: { id },
      data,
      select: { id: true, nombre: true, email: true, rol: true },
    });
  }
}