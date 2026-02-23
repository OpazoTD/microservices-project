import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';


@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { 
          expiresIn: config.get<string>('JWT_EXPIRES_IN', '1h') as any, // Aseguramos que el valor tenga un fallback y sea del tipo correcto
        },
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
            // Aseguramos que los valores existan o tengan fallback
            host: config.get<string>('MS_USER_HOST', 'usuarios-ms'),
            port: Number(config.get<number>('MS_USER_PORT', 3001)),
          },
        }),
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
