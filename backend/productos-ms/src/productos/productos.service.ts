import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './producto.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productosRepo: Repository<Producto>,
  ) {}

  async create(data: Partial<Producto>) {
    const producto = this.productosRepo.create(data);
    return this.productosRepo.save(producto);
  }

  async findAll() {
    return this.productosRepo.find({ where: { activo: true } });
  }

  async findOne(id: number) {
    const prod = await this.productosRepo.findOne({ where: { id } });
    if (!prod) throw new NotFoundException('Producto no encontrado');
    return prod;
  }

  async reservarStock(productoId: number, cantidad: number) {
    const prod = await this.findOne(productoId);
    const disponible = prod.stock - prod.stockReservado;
    if (disponible < cantidad) {
      throw new BadRequestException('Stock insuficiente');
    }
    prod.stockReservado += cantidad;
    return this.productosRepo.save(prod);
  }

  async confirmarCompra(productoId: number, cantidad: number) {
    const prod = await this.findOne(productoId);
    prod.stock -= cantidad;
    prod.stockReservado -= cantidad;
    return this.productosRepo.save(prod);
  }

  async liberarReserva(productoId: number, cantidad: number) {
    const prod = await this.findOne(productoId);
    prod.stockReservado = Math.max(0, prod.stockReservado - cantidad);
    return this.productosRepo.save(prod);
  }
}
