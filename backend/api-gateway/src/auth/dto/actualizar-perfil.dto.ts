import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ActualizarPerfilDto {
  @ApiPropertyOptional({ 
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez García' 
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  nombre?: string;

  @ApiPropertyOptional({ 
    description: 'Correo electrónico único',
    example: 'nuevo@correo.com' 
  })
  @IsOptional()
  @IsEmail({}, { message: 'El formato del correo no es válido' })
  email?: string;

  @ApiPropertyOptional({ 
    description: 'Nueva contraseña (mínimo 6 caracteres)',
    example: 'nuevaClave123' 
  })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'La clave debe tener al menos 6 caracteres' })
  clave?: string;
}
