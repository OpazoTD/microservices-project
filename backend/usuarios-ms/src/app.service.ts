import { Injectable, NotFoundException, ConflictException, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Rol } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from './prisma.service';

@Injectable()
export class UsuariosService implements OnModuleInit {
  private readonly logger = new Logger(UsuariosService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.ensureAdminUser();
  }

  private async ensureAdminUser() {
    const autoSeedAdmin = (process.env.AUTO_SEED_ADMIN ?? 'true').toLowerCase() !== 'false';

    if (!autoSeedAdmin) {
      this.logger.log('AUTO_SEED_ADMIN=false, se omite bootstrap de usuario administrador');
      return;
    }

    const adminEmail = (process.env.ADMIN_EMAIL ?? 'admin@correo.com').trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin1234';
    const adminName = process.env.ADMIN_NAME ?? 'Admin';

    const existing = await this.prisma.usuario.findUnique({ where: { email: adminEmail } });

    if (!existing) {
      const hashed = await bcrypt.hash(adminPassword, 10);

      await this.prisma.usuario.create({
        data: {
          nombre: adminName,
          email: adminEmail,
          password: hashed,
          rol: Rol.ADMIN,
          activo: true,
          cart: { create: {} },
        },
      });

      this.logger.log(`Usuario administrador creado automáticamente: ${adminEmail}`);
      return;
    }

    if (existing.rol !== Rol.ADMIN || !existing.activo) {
      await this.prisma.usuario.update({
        where: { id: existing.id },
        data: { rol: Rol.ADMIN, activo: true },
      });

      this.logger.log(`Usuario administrador actualizado a rol ADMIN: ${adminEmail}`);
    }
  }

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