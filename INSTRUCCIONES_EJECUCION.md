# 🚀 Proyecto E-commerce con Microservicios - Guía Completa

## 📋 Índice
- [Requisitos](#requisitos)
- [Arquitectura](#arquitectura)
- [Ejecución Rápida](#ejecución-rápida)
- [Endpoints del API](#endpoints-del-api)
- [Comunicación entre Servicios](#comunicación-entre-servicios)
- [Troubleshooting](#troubleshooting)

---

## Requisitos

### Software necesario:
- 🐳 Docker Desktop (versión 24.0 o superior)
- 📦 Docker Compose (versión 2.0 o superior)
- 🔧 Node.js 20 (solo si deseas desarrollo local)

### Instalación en Windows:
```bash
# Descargar Docker Desktop desde:
# https://www.docker.com/products/docker-desktop

# Verificar instalación:
docker --version
docker-compose --version
```

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                  CLIENTE (React/Frontend)                    │
│                  :5173 o localhost:3000                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
            ┌────────────────────┐
            │  API GATEWAY       │
            │  :3000             │
            │  (NestJS + JWT)    │
            └────┬───┬─────┬─────┘
                 │   │     │
      ┌──────────┘   │     └──────────┬─────────┐
      │              │                │         │
      ▼              ▼                ▼         ▼
  ┌────────┐   ┌─────────┐   ┌──────────┐  ┌────────┐
  │USUARIOS│   │PRODUCTOS│   │ FACTURAS │  │CARRITO │
  │  MS    │   │   MS    │   │   MS     │  │(Local) │
  │:3001   │   │:3002/04 │   │  :3003   │  │        │
  │(TCP)   │   │(TCP/HTTP)   │  (TCP)    │  │        │
  └────┬───┘   └────┬────┘   └────┬─────┘  └────────┘
       │            │             │
       ▼            ▼             ▼
   ┌────────┐  ┌────────┐   ┌─────────┐
   │PostgreSQL  │MySQL   │   │MongoDB   │
   │:5433   │  │:3307   │   │:27018   │
   │usuarios_db │productos_db  │facturas_db│
   └────────┘  └────────┘   └─────────┘
```

---

## Ejecución Rápida

### 1. **Preparar el Proyecto**

```bash
# Navegar al directorio del proyecto
cd c:\Users\opazo\DevArchives\microservices-project

# Limpiar contenedores y volúmenes anteriores (OPCIONAL - si hay problemas)
docker-compose down -v
docker system prune -f
```

### 2. **Construir e Iniciar Servicios**

```bash
# Construir las imágenes y iniciar los contenedores
docker-compose up -d --build

# Esto demorará 2-5 minutos la primera vez (descargando dependencias)
```

### 3. **Verificar que están corriendo**

```bash
# Listar contenedores
docker ps

# Deberías ver:
# - ms-gateway
# - ms-usuarios
# - ms-productos
# - ms-facturas
# - ms-postgres
# - ms-mysql
# - ms-mongodb
```

### 4. **Ver logs en tiempo real**

```bash
# Gateway logs
docker logs -f ms-gateway

# O todos los logs juntos
docker-compose logs -f
```

---

## Endpoints del API

### 🔐 **Autenticación** (`/api/auth`)

#### Registro de Usuario
```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "clave": "password123"
}

# Response:
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "rol": "USER"
}
```

#### Login
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "clave": "password123"
}

# Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "email": "juan@example.com"
}
```

#### Obtener Perfil (Requiere JWT)
```bash
GET http://localhost:3000/api/auth/profile
Authorization: Bearer {access_token}
```

---

### 📦 **Productos** (`/api/productos`)

#### Obtener Todos los Productos
```bash
GET http://localhost:3000/api/productos

# Response:
[
  {
    "id": 1,
    "nombre": "Laptop",
    "descripcion": "Laptop gaming",
    "precio": 1500,
    "stock": 10
  }
]
```

#### Obtener Producto por ID
```bash
GET http://localhost:3000/api/productos/:id
```

#### Crear Producto (Admin)
```bash
POST http://localhost:3000/api/productos
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "nombre": "Mouse Gamer",
  "descripcion": "Mouse óptico 16000 DPI",
  "precio": 45,
  "stock": 50
}
```

---

### 🛒 **Carrito** (`/api/carrito`)

#### Agregar Producto al Carrito
```bash
POST http://localhost:3000/api/carrito/agregar
Authorization: Bearer {token}
Content-Type: application/json

{
  "productoId": 1,
  "cantidad": 2
}

# Response:
{
  "success": true,
  "reservaId": 123,
  "productoId": 1,
  "cantidad": 2,
  "mensaje": "Producto reservado y agregado al carrito"
}
```

#### Realizar Compra
```bash
POST http://localhost:3000/api/carrito/comprar
Authorization: Bearer {token}
Content-Type: application/json

{
  "metodoPago": "Tarjeta de Crédito",
  "direccion": "Calle Principal 123, Ciudad"
}

# Response (Factura creada):
{
  "id": "factura_id_mongo",
  "usuarioId": "1",
  "total": 3000,
  "estado": "completada",
  "createdAt": "2026-02-22T10:30:00Z"
}
```

---

### 📋 **Facturas** (`/api/facturas`)

#### Ver Mis Facturas
```bash
GET http://localhost:3000/api/facturas/mis-facturas
Authorization: Bearer {token}

# Response:
[
  {
    "id": "factura_id",
    "usuarioId": "1",
    "nombreUser": "Juan Pérez",
    "emailUser": "juan@example.com",
    "total": 3000,
    "productos": [
      {
        "productoId": "1",
        "nombre": "Laptop",
        "cantidad": 1,
        "precioUnit": 1500,
        "subtotal": 1500
      }
    ],
    "createdAt": "2026-02-22T10:30:00Z"
  }
]
```

#### Crear Factura
```bash
POST http://localhost:3000/api/facturas
Authorization: Bearer {token}
Content-Type: application/json

{
  "metodoPago": "Tarjeta",
  "direccion": "Dirección de envío"
}
```

---

### 👥 **Usuarios** (`/api/usuarios`)

#### Registrar Usuario
```bash
POST http://localhost:3000/api/usuarios/registrar
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Nuevo Usuario",
  "email": "nuevo@example.com",
  "clave": "password123"
}
```

#### Obtener Todos los Usuarios (Admin)
```bash
GET http://localhost:3000/api/usuarios
Authorization: Bearer {admin_token}
```

#### Obtener Usuario por ID
```bash
GET http://localhost:3000/api/usuarios/:id
Authorization: Bearer {token}
```

#### Actualizar Perfil
```bash
PUT http://localhost:3000/api/usuarios/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Nombre Actualizado",
  "email": "nuevo_email@example.com"
}
```

---

### 🏥 **Health Check**

```bash
GET http://localhost:3000/api/health

# Response:
{
  "status": "API Gateway is running",
  "timestamp": "2026-02-22T10:30:00.000Z"
}
```

---

### 📚 **Documentación Interactiva (Swagger)**

Acceder a Swagger UI:
```
http://localhost:3000/docs
```

---

## Comunicación entre Servicios

### 🔄 **Flujo de Reserva de Stock**

```
1. Cliente → Gateway
   POST /api/carrito/agregar
   
2. Gateway → Productos MS (TCP :3004)
   send({ cmd: 'reservar_stock' }, { productoId, usuarioId, cantidad })
   
3. Productos MS verifica stock, crea reserva (15 min)
   return { id: reservaId, productoId, cantidad, ... }
   
4. Gateway → Facturas MS (TCP :3003)
   send({ cmd: 'agregar_item_carrito' }, { reservaId, productoId, cantidad, ... })
   
5. Facturas MS guarda item temporal
   return { success: true, mensaje: "..." }
   
6. Gateway → Cliente
   Response 201 Created
```

### 🛍️ **Flujo de Compra Final**

```
1. Cliente → Gateway
   POST /api/carrito/comprar ( { metodoPago, direccion } )
   
2. Gateway → Facturas MS (TCP :3004)
   send({ cmd: 'crear_factura' }, { userId, articulos, monto, ... })
   
3. Facturas MS:
   a. Para cada artículo:
      → Productos MS: send({ cmd: 'confirmar_compra' }, { reservaId })
      
   b. Confirma compra: actualiza stock en Productos MS
   
   c. Crea factura en MongoDB
   
4. Facturas MS → Gateway
   return { id, usuarioId, total, productos, ... }
   
5. Gateway → Cliente
   Response 201 Created
```

---

## Variables de Entorno

### API Gateway (docker-compose)
```yaml
MS_USER_HOST: usuarios-ms          # Host de Usuarios MS
MS_USER_PORT: 3001                 # Puerto TCP
MS_PRODUCT_HOST: productos-ms      # Host de Productos MS
MS_PRODUCT_PORT: 3004              # Puerto TCP
MS_INVOICE_HOST: facturas-ms       # Host de Facturas MS
MS_INVOICE_PORT: 3003              # Puerto TCP
JWT_SECRET: "tu_clave_super_secreta"
```

### Bases de Datos
```yaml
# PostgreSQL (Usuarios)
DATABASE_URL: postgresql://admin:admin123@postgres:5432/usuarios_db

# MySQL (Productos)
DB_HOST: mysql
DB_PORT: 3306
DB_USERNAME: admin
DB_PASSWORD: admin123
DB_DATABASE: productos_db

# MongoDB (Facturas)
DATABASE_URL: mongodb://admin:admin123@mongodb:27017/facturas_db?authSource=admin
```

---

## Troubleshooting

### ❌ Error: "Cannot connect to Docker daemon"
```bash
# Solución: Iniciar Docker Desktop
# En Windows: Abrir Docker Desktop desde el menú de inicio
# Esperar a que cargue completamente
```

### ❌ Error: "Port 3000 already in use"
```bash
# Solución: Usar puerto diferente
docker-compose up -d --build -p 3001

# O terminar el proceso que usa el puerto
# En Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### ❌ Error: "Connection refused" en logs de microservicios
```bash
# Verificar que el gateway tiene variables de entorno correctas
docker-compose config

# Reiniciar los servicios
docker-compose restart

# Ver logs detallados
docker logs ms-gateway -n 50 -f
```

### ❌ Error de Prisma en usuarios-ms
```bash
# Verificar que PostgreSQL está corriendo
docker logs ms-postgres

# Reiniciar el servicio de usuarios
docker-compose restart usuarios-ms

# Ver logs
docker logs ms-usuarios -f
```

### ❌ Error de conexión a base de datos
```bash
# Verificar que los nombres de servicio son correctos en docker-compose
docker network ls
docker network inspect microservices-project_ms-network

# Si es necesario, reconstruir:
docker-compose down -v
docker-compose up -d --build
```

### ✅ Verificar que todo funciona

```bash
# 1. Health check
curl http://localhost:3000/api/health

# 2. Ver todos los contenedores
docker ps

# 3. Ver logs de todos los servicios
docker-compose logs

# 4. Acceder a Swagger
# Navegar a: http://localhost:3000/docs
```

---

## Scripts Útiles

### Limpiar y reiniciar todo
```bash
docker-compose down -v
docker system prune -f
docker-compose up -d --build
```

### Ver logs en tiempo real
```bash
# Gateway
docker logs -f ms-gateway

# Todos
docker-compose logs -f

# Específico
docker logs -f ms-productos
```

### Ejecutar comando en contenedor
```bash
# Acceder a bash en un contenedor
docker exec -it ms-gateway sh

# Ejecutar comando
docker exec ms-usuarios npm run build
```

### Verificar conexión a BD

```bash
# PostgreSQL
docker exec -it ms-postgres psql -U admin -d usuarios_db

# MySQL
docker exec -it ms-mysql mysql -u admin -p admin123 -D productos_db

# MongoDB
docker exec -it ms-mongodb mongosh -u admin -p admin123
```

---

## Información Adicional

### Puertos Mapeados
| Servicio | Interno | Externo | Tipo |
|----------|---------|---------|------|
| API Gateway | 3000 | 3000 | HTTP |
| Usuarios MS | 3001 | 3001 | TCP |
| Productos MS HTTP | 3002 | 3002 | HTTP |
| Productos MS TCP | 3004 | 3004 | TCP |
| Facturas MS | 3003 | 3003 | TCP |
| PostgreSQL | 5432 | 5433 | DB |
| MySQL | 3306 | 3307 | DB |
| MongoDB | 27017 | 27018 | DB |

### Credenciales de BD
```
PostgreSQL:
  Usuario: admin
  Contraseña: admin123
  Base de datos: usuarios_db

MySQL:
  Usuario: admin
  Contraseña: admin123
  Base de datos: productos_db

MongoDB:
  Usuario: admin
  Contraseña: admin123
  Base de datos: facturas_db
```

---

## Soporte

Si encuentras problemas:
1. Revisa los logs: `docker-compose logs`
2. Verifica que Docker está corriendo: `docker ps`
3. Intenta reiniciar: `docker-compose restart`
4. Si persiste: limpia y reconstruye `docker-compose down -v && docker-compose up -d --build`

---

**Último actualizado:** 22/02/2026
**Estado:** ✅ Completamente funcional
