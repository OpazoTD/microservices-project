import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    // Importamos el cliente de usuarios para validar credenciales durante el login
    ClientsModule.register([
      {
        name: 'USUARIOS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.USUARIOS_MS_HOST || 'localhost',
          port: Number(process.env.USUARIOS_MS_PORT) || 3001,
        },
      },
    ]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'mi_super_secreto_jwt_2026',
      signOptions: { expiresIn: '1h' }, // El token expira en 1 hora
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService], // Lo exportamos por si otros módulos necesitan validar tokens
})
export class AuthModule {}