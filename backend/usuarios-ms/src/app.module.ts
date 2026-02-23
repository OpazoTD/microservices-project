import { Module } from '@nestjs/common';
import { UsuariosController } from './app.controller';
import { UsuariosService } from './app.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [],
  controllers: [UsuariosController],
  providers: [UsuariosService, PrismaService],
})
export class AppModule {}