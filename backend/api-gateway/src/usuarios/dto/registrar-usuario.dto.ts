import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegistrarUsuarioDto {
  @ApiProperty({ 
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez' 
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @ApiProperty({ 
    description: 'Correo electrónico único',
    example: 'usuario@correo.com' 
  })
  @IsEmail({}, { message: 'El formato del correo no es válido' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    description: 'Contraseña de acceso (mínimo 6 caracteres)',
    example: '123456' 
  })
  @IsString()
  @MinLength(6, { message: 'La clave debe tener al menos 6 caracteres' })
  @IsNotEmpty()
  clave: string;
}