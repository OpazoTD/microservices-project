# Facturas Microservice - Prisma MongoDB Setup

Este microservicio usa **Prisma 7.4.1** con **MongoDB** para gestionar las facturas.

## 🗄️ Base de Datos

- **Motor**: MongoDB
- **Puerto**: 27017
- **Base de datos**: `facturas_db`
- **Credenciales** (desarrollo):
  - Usuario: `admin`
  - Contraseña: `admin123`

## 📦 Prisma Configuration

### Archivos principales:
- `prisma/schema.prisma` - Define el modelo de datos
- `prisma.config.ts` - Configuración de Prisma
- `src/prisma.service.ts` - Servicio NestJS para Prisma

### Schema de Factura

```prisma
model Factura {
  id          String            @id @default(auto()) @map("_id") @db.ObjectId
  usuarioId   String
  nombreUser  String
  emailUser   String
  productos   ProductoFactura[]
  total       Float
  estado      String            @default("completada")
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
}

type ProductoFactura {
  productoId  String
  nombre      String
  cantidad    Int
  precioUnit  Float
  subtotal    Float
}
```

## 🚀 Comandos Disponibles

### Generar Prisma Client
```bash
npm run prisma:generate
```

### Abrir Prisma Studio (GUI)
```bash
npm run prisma:studio
```

### Inicializar Base de Datos
```bash
npm run db:init
```

## 🔧 Desarrollo Local

1. **Instalar dependencias**:
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Generar Prisma Client**:
   ```bash
   npm run prisma:generate
   ```

3. **Ejecutar en modo desarrollo**:
   ```bash
   npm run start:dev
   ```

## 🐳 Docker

El Dockerfile ya está configurado para:
- Instalar Prisma 7.4.1
- Generar el cliente durante el build
- Copiar los archivos necesarios al contenedor de producción

### Reconstruir contenedor:
```bash
docker compose up -d --build facturas-ms
```

## 📝 Notas Importantes

### MongoDB vs PostgreSQL con Prisma

- **No requiere migraciones**: MongoDB es una base de datos sin esquema, por lo que no necesitas ejecutar `prisma migrate` como en PostgreSQL.
- **Generación automática de ID**: MongoDB usa ObjectId automáticamente.
- **Schema flexible**: Puedes agregar campos sin necesidad de migraciones.
- **Índices**: Se crean automáticamente basándose en el schema.

### Variables de Entorno

Asegúrate de tener configurado en tu `.env` o `docker-compose.yml`:

```env
DATABASE_URL=mongodb://admin:admin123@mongo:27017/facturas_db?authSource=admin
```

## 🔍 Verificación

Para verificar que todo funciona correctamente:

1. **Ver logs del contenedor**:
   ```bash
   docker compose logs facturas-ms
   ```
   
2. **Buscar el mensaje**:
   ```
   ✅ Conexión a MongoDB establecida correctamente
   ```

3. **Ejecutar script de inicialización**:
   ```bash
   docker compose exec facturas-ms npm run db:init
   ```

## 🐛 Troubleshooting

### Error: Cannot connect to MongoDB
- Verifica que el contenedor `mongo` esté corriendo
- Verifica las credenciales en `DATABASE_URL`
- Verifica que el puerto 27017 no esté bloqueado

### Error: Prisma Client not generated
```bash
docker compose exec facturas-ms npm run prisma:generate
```

### Error: Invalid ObjectId
- Asegúrate de que los IDs que envías sean strings válidos de ObjectId (24 caracteres hexadecimales)
