import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Dentro del contenedor: usar el nombre del servicio 'postgres' y puerto 5432
    url: process.env.DATABASE_URL ?? "postgresql://admin:admin123@postgres:5432/usuarios_db"
  },
});
