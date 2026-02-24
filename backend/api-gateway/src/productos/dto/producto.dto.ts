import { IsString, IsNumber, IsPositive, IsInt, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductoDto {
  @ApiProperty({ 
    example: 'Laptop HP', 
    description: 'Nombre completo del producto comercial' 
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre: string;

  @ApiProperty({ 
    example: 'Laptop HP 15.6 pulgadas, procesador Intel i7', 
    description: 'Descripción detallada del producto',
    required: false 
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsOptional()
  descripcion?: string;

  @ApiProperty({ 
    example: 599.99, 
    description: 'Precio unitario en la moneda local' 
  })
  @IsNumber({}, { message: 'El precio debe ser un número válido' })
  @IsPositive({ message: 'El precio debe ser un valor positivo' })
  precio: number;

  @ApiProperty({ 
    example: 50, 
    description: 'Cantidad de unidades físicas disponibles' 
  })
  @IsInt({ message: 'El stock debe ser un número entero (sin decimales)' })
  @Min(0, { message: 'El stock no puede ser un número negativo' })
  stock: number;

  @ApiProperty({ 
    example: 'uploads/productos/laptop-hp.jpg', 
    required: false,
    description: 'URL o ruta interna de la imagen del producto' 
  })
  @IsString({ message: 'La URL de la imagen debe ser texto' })
  @IsOptional()
  imagenUrl?: string;
}