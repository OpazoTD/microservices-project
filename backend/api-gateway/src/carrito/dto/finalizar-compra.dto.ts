import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ItemCarritoDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  productoId: number;

  @ApiProperty({ example: 'Producto ejemplo' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  cantidad: number;

  @ApiProperty({ example: 99.99 })
  @IsNumber()
  precioUnit: number;

  @ApiProperty({ example: 123, required: false })
  @IsOptional()
  @IsNumber()
  reservaId?: number;
}

export class FinalizarCompraDto {
  @ApiProperty({ type: [ItemCarritoDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemCarritoDto)
  @IsNotEmpty()
  articulos: ItemCarritoDto[];

  @ApiProperty({ example: 199.98, required: false })
  @IsOptional()
  @IsNumber()
  montoTotal?: number;
}
