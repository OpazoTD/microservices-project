import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const databaseUrl = process.env.DATABASE_URL ?? 'mongodb://admin:admin123@mongo:27017/facturas_db?authSource=admin';
    
    super({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
      log: ['query', 'error', 'warn'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Conexión a MongoDB establecida correctamente');
    } catch (error) {
      this.logger.error('❌ Error al conectar con MongoDB:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('🔌 Desconectado de MongoDB');
  }
}