import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IniciarSesionDto {
  @ApiProperty({ example: 'usuario@correo.com' })
  @IsEmail({}, { message: 'Formato de correo inválido' })
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  clave: string;
}