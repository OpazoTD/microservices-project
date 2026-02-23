import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ProductosModule } from './productos/productos.module';
import { FacturasModule } from './facturas/facturas.module';
import { CarritoModule } from './carrito/carrito.module'; // Importa tu nueva carpeta
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsuariosModule,
    ProductosModule,
    FacturasModule,
    CarritoModule,
  ],
  controllers: [AppController], 
  providers: [AppService],
})
export class AppModule {}