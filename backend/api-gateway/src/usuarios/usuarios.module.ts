import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsuariosController } from './usuarios.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USUARIOS_SERVICE', // Nombre para identificar el microservicio internamente
        transport: Transport.TCP,
        options: {
          // Si corres en Docker, el host es el nombre del servicio en docker-compose
          // Si corres local (npm run start), usa 'localhost'
          host: process.env.USUARIOS_MS_HOST || 'localhost',
          port: Number(process.env.USUARIOS_MS_PORT) || 3001,
        },
      },
    ]),
  ],
  controllers: [UsuariosController],
  providers: [],
})
export class UsuariosModule {}