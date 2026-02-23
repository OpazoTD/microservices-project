import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsuariosController } from './usuarios.controller';
import { ServicioUsuarios } from './usuarios.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'mi_super_secreto_jwt_2026',
        signOptions: { expiresIn: '24h' },
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: 'USUARIOS_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>('MS_USER_HOST', 'usuarios-ms'),
            port: config.get<number>('MS_USER_PORT', 3001),
          },
        }),
      },
    ]),
  ],
  controllers: [UsuariosController],
  providers: [ServicioUsuarios],
  exports: [ServicioUsuarios],
})
export class UsuariosModule {}