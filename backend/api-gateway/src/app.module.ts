import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ProductosModule } from './productos/productos.module';
import { FacturasModule } from './facturas/facturas.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USUARIOS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.USUARIOS_MS_HOST || 'localhost',
          port: parseInt(process.env.USUARIOS_MS_PORT || '3001', 10),
        },
      },
      {
        name: 'PRODUCTOS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.PRODUCTOS_MS_HOST || 'localhost',
          port: parseInt(process.env.PRODUCTOS_MS_PORT || '3002', 10),
        },
      },
      {
        name: 'FACTURAS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.FACTURAS_MS_HOST || 'localhost',
          port: parseInt(process.env.FACTURAS_MS_PORT || '3003', 10),
        },
      },
    ]),
    AuthModule,
    UsuariosModule,
    ProductosModule,
    FacturasModule,
  ],
})
export class AppModule {}
