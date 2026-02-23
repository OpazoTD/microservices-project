import { PartialType } from '@nestjs/swagger';
import { ProductoDto } from './producto.dto';

// Al usar PartialType, heredas todos los mensajes de error y ejemplos,
// pero todos los campos pasan a ser opcionales automáticamente.
export class ActualizarProductoDto extends PartialType(ProductoDto) {}