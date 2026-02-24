import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActualizarEstadoUsuarioDto {
  @ApiProperty({ 
    description: 'Estado del usuario (activo/inactivo)',
    example: false 
  })
  @IsBoolean()
  activo: boolean;
}
