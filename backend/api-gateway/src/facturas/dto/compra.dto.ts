import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ArticuloDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  productoId: number;

  @ApiProperty({ example: 'Laptop' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  cantidad: number;

  @ApiProperty({ example: 500.0 })
  @IsNumber()
  precioUnit: number;

  @ApiProperty({ example: 123, required: false })
  @IsOptional()
  @IsNumber()
  reservaId?: number;
}

export class CompraDto {
  @ApiProperty({ type: [ArticuloDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ArticuloDto)
  articulos: ArticuloDto[];

  @ApiProperty({ example: 'Tarjeta de Crédito' })
  @IsString()
  @IsNotEmpty()
  metodoPago: string;

  @ApiProperty({ example: 'Calle Falsa 123, Ciudad' })
  @IsString()
  @IsNotEmpty()
  direccion: string;
}