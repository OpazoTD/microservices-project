import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum Rol {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export class ActualizarUsuarioDto {
  @ApiPropertyOptional({ 
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez' 
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  nombre?: string;

  @ApiPropertyOptional({ 
    description: 'Correo electrónico único',
    example: 'usuario@correo.com' 
  })
  @IsOptional()
  @IsEmail({}, { message: 'El formato del correo no es válido' })
  email?: string;

  @ApiPropertyOptional({ 
    description: 'Contraseña de acceso (mínimo 6 caracteres)',
    example: '123456' 
  })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'La clave debe tener al menos 6 caracteres' })
  clave?: string;

  @ApiPropertyOptional({ 
    description: 'Rol del usuario',
    example: 'ADMIN', 
    enum: Rol 
  })
  @IsOptional()
  @IsEnum(Rol)
  rol?: Rol;

  @ApiPropertyOptional({ 
    description: 'Estado del usuario (activo/inactivo)',
    example: true 
  })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}