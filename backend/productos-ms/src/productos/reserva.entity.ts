import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Producto } from './producto.entity';

export enum EstadoReserva {
  PENDIENTE  = 'PENDIENTE',
  COMPLETADA = 'COMPLETADA',
  EXPIRADA   = 'EXPIRADA',
}

@Entity('reservas')
export class Reserva {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Producto, (p) => p.reservas)
  producto: Producto;

  @Column()
  productoId: number;

  @Column()
  usuarioId: number; // Referencia al usuarios-ms

  @Column()
  cantidad: number;

  @Column({ type: 'enum', enum: EstadoReserva, default: EstadoReserva.PENDIENTE })
  estado: EstadoReserva;

  @Column()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}