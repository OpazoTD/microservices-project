import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Producto } from './producto.entity';
import { Reserva, EstadoReserva } from './reserva.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto) private productosRepo: Repository<Producto>,
    @InjectRepository(Reserva) private reservasRepo: Repository<Reserva>,
  ) {}

  async create(data: any) {
    const nuevoProducto = this.productosRepo.create({
      nombre: data.nombre,
      descripcion: data.descripcion,
      precio: data.precio,
      stock: data.stock,
      imagenUrl: data.imagenUrl,
    });
    return await this.productosRepo.save(nuevoProducto);
  }

  async update(id: number, data: any) {
    const producto = await this.productosRepo.findOne({ where: { id } });
    if (!producto) throw new NotFoundException('Producto no encontrado');

    Object.assign(producto, data);
    return await this.productosRepo.save(producto);
  }

  async delete(id: number) {
    const producto = await this.productosRepo.findOne({ where: { id } });
    if (!producto) throw new NotFoundException('Producto no encontrado');

    return await this.productosRepo.remove(producto);
  }

  async findAll() {
    return this.productosRepo.find();
  }

  async findOne(id: number) {
    const prod = await this.productosRepo.findOne({ where: { id } });
    if (!prod) throw new NotFoundException('Producto no encontrado');
    return prod;
  }

  async reservarStock(productoId: number, usuarioId: number, cantidad: number) {
    return this.productosRepo.manager.transaction(async (manager) => {
      const producto = await manager.findOne(Producto, {
        where: { id: productoId },
        relations: ['reservas'],
        lock: { mode: 'pessimistic_write' },
      });

      if (!producto) throw new NotFoundException('Producto no encontrado');

      const totalReservado = producto.reservas
        .filter(r => r.estado === EstadoReserva.PENDIENTE && r.expiresAt > new Date())
        .reduce((sum, r) => sum + r.cantidad, 0);

      if ((producto.stock - totalReservado) < cantidad) {
        throw new BadRequestException('Sin stock disponible (incluyendo reservas)');
      }

      const reserva = manager.create(Reserva, {
        producto,
        productoId,
        usuarioId,
        cantidad,
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 días de reserva
      });

      return manager.save(reserva);
    });
  }

  async confirmarCompra(reservaId: number) {
    return this.productosRepo.manager.transaction(async (manager) => {
      const reserva = await manager.findOne(Reserva, {
        where: { id: reservaId },
        relations: ['producto'],
        lock: { mode: 'pessimistic_write' },
      });

      if (!reserva || reserva.estado !== EstadoReserva.PENDIENTE) {
        throw new BadRequestException('Reserva no válida');
      }

      reserva.producto.stock -= reserva.cantidad;
      reserva.estado = EstadoReserva.COMPLETADA;

      await manager.save(reserva.producto);
      return manager.save(reserva);
    });
  }
}