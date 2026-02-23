import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // Dentro del contenedor: usar el nombre del servicio 'mongo' y puerto 27017
    url: process.env.DATABASE_URL ?? "mongodb://admin:admin123@mongo:27017/facturas_db?authSource=admin"
  },
});
