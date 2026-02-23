import { PartialType } from '@nestjs/swagger';
import { RegistrarUsuarioDto } from './registrar-usuario.dto';
export class ActualizarUsuarioDto extends PartialType(RegistrarUsuarioDto) {}