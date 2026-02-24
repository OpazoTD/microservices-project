import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class IniciarSesionDto {
  @ApiProperty({ example: 'usuario@correo.com' })
  @IsEmail({}, { message: 'Formato de correo inválido' })
  email: string;

  @ApiProperty({ example: '123456' })
  @Transform(({ value, obj }) => value ?? obj?.password)
  @IsString()
  clave: string;
}