# 🚀 Microservices E-Commerce Project

Sistema de comercio electrónico basado en microservicios con NestJS, PostgreSQL, MySQL y MongoDB.

---

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#-requisitos-previos)
2. [Instalación Inicial](#-instalación-inicial)
3. [Comandos Docker](#-comandos-docker)
4. [Arquitectura](#-arquitectura)
5. [Endpoints de la API](#-endpoints-de-la-api)
6. [Uso Paso a Paso](#-uso-paso-a-paso)
7. [Variables de Entorno](#-variables-de-entorno)
8. [Solución de Problemas](#-solución-de-problemas)

---

## 🔧 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** v20 o superior ([Descargar](https://nodejs.org/))
- **Docker** v24 o superior ([Descargar](https://www.docker.com/products/docker-desktop/))
- **Docker Compose** v2.0 o superior (incluido con Docker Desktop)
- **Git** ([Descargar](https://git-scm.com/))

Verifica las instalaciones:
```bash
node --version
docker --version
docker-compose --version
git --version
```

---

## 📥 Instalación Inicial

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/microservices-project.git
cd microservices-project
```

### 2. Instalar Dependencias (Opcional para desarrollo local)

```bash
cd backend
npm install

# Instalar dependencias de cada microservicio
cd api-gateway && npm install && cd ..
cd usuarios-ms && npm install && cd ..
cd productos-ms && npm install && cd ..
cd facturas-ms && npm install && cd ..
```

> **Nota:** Si solo usarás Docker, este paso es opcional ya que Docker instalará las dependencias automáticamente.

### 3. Construir e Iniciar los Contenedores

```bash
# Desde la raíz del proyecto
docker-compose up --build -d
```

### 4. Verificar que los Contenedores Estén Corriendo

```bash
docker-compose ps
```

Deberías ver 7 contenedores corriendo:
- `ms-gateway` (Puerto 3000)
- `ms-usuarios`
- `ms-productos`
- `ms-facturas`
- `pg_usuarios` (PostgreSQL - Puerto 5432)
- `mysql_productos` (MySQL - Puerto 3306)
- `mongo_facturas` (MongoDB - Puerto 27017)

### 5. Verificar la API

Abre tu navegador en:
- **API Gateway:** http://localhost:3000/api
- **Swagger Docs:** http://localhost:3000/docs

---

## 🐳 Comandos Docker

### Iniciar la Aplicación

```bash
# Primera vez (construye las imágenes)
docker-compose up --build -d

# Inicios posteriores (usa imágenes existentes)
docker-compose up -d
```

### Detener la Aplicación

```bash
# Detener contenedores (mantiene datos)
docker-compose stop

# Detener y eliminar contenedores (mantiene volúmenes de BD)
docker-compose down

# Detener, eliminar contenedores Y BORRAR DATOS
docker-compose down -v
```

### Reiniciar Servicios

```bash
# Reiniciar todos los servicios
docker-compose restart

# Reiniciar un servicio específico
docker-compose restart gateway
docker-compose restart usuarios-ms
docker-compose restart productos-ms
docker-compose restart facturas-ms
```

### Reconstruir y Actualizar

```bash
# Reconstruir todos los servicios
docker-compose up --build -d

# Reconstruir un servicio específico
docker-compose up --build -d gateway
docker-compose up --build -d usuarios-ms
```

### Ver Logs

```bash
# Ver logs de todos los servicios
docker-compose logs

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs gateway
docker-compose logs -f usuarios-ms

# Ver últimas 50 líneas
docker logs ms-gateway --tail 50
```

### Ver Estado de los Contenedores

```bash
# Ver contenedores corriendo
docker-compose ps

# Ver detalles de recursos
docker stats
```

### Ejecutar Comandos Dentro de Contenedores

```bash
# Acceder a shell de un contenedor
docker exec -it ms-gateway sh
docker exec -it pg_usuarios psql -U postgres

# Ejecutar migraciones de Prisma
docker exec -it ms-usuarios npx prisma migrate deploy
docker exec -it ms-facturas npx prisma migrate deploy
```

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                   API GATEWAY                       │
│              (Puerto 3000)                          │
│         NestJS + JWT Authentication                 │
└──────────────┬──────────────┬──────────────┬────────┘
               │              │              │
       ┌───────▼───────┐ ┌────▼────┐ ┌──────▼──────┐
       │  Usuarios MS  │ │Productos│ │  Facturas   │
       │   (TCP 3001)  │ │   MS    │ │     MS      │
       │               │ │(TCP 3002)│ │(TCP 3003)   │
       └───────┬───────┘ └────┬────┘ └──────┬──────┘
               │              │              │
       ┌───────▼───────┐ ┌────▼────┐ ┌──────▼──────┐
       │  PostgreSQL   │ │  MySQL  │ │  MongoDB    │
       │  (Puerto 5432)│ │(Pto 3306)│ │(Pto 27017) │
       └───────────────┘ └─────────┘ └─────────────┘
```

### Microservicios

| Servicio | Puerto | Base de Datos | Función |
|----------|--------|---------------|---------|
| **API Gateway** | 3000 | - | Punto de entrada, autenticación JWT |
| **Usuarios MS** | 3001 (TCP) | PostgreSQL | Gestión de usuarios y roles |
| **Productos MS** | 3002 (TCP) | MySQL | Inventario y reservas de stock |
| **Facturas MS** | 3003 (TCP) | MongoDB | Procesamiento de compras |

---

## 📡 Endpoints de la API

**Base URL:** `http://localhost:3000/api`

### 🔐 Autenticación

#### Registrar Usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@correo.com",
  "clave": "password123"
}
```

#### Iniciar Sesión
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@correo.com",
  "clave": "password123"
}

# Respuesta:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": 1, "nombre": "Juan", "email": "juan@correo.com", "rol": "USER" }
}
```

#### Ver Perfil (Autenticado)
```http
GET /api/auth/profile
Authorization: Bearer {token}
```

#### Actualizar Mi Perfil (Autenticado)
```http
PUT /api/auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Nuevo Nombre",      // opcional
  "email": "nuevo@correo.com",   // opcional
  "clave": "nuevaPassword123"    // opcional
}
```

---

### 👥 Usuarios (Solo Admin)

#### Listar Todos los Usuarios
```http
GET /api/usuarios
Authorization: Bearer {token_admin}
```

#### Obtener Usuario por ID
```http
GET /api/usuarios/{id}
Authorization: Bearer {token}
```

#### Actualizar Usuario (Admin)
```http
PUT /api/usuarios/{id}
Authorization: Bearer {token_admin}
Content-Type: application/json

{
  "nombre": "Nombre Actualizado",  // opcional
  "email": "nuevo@correo.com",     // opcional
  "clave": "password123",          // opcional
  "rol": "ADMIN",                  // opcional: USER | ADMIN
  "activo": true                   // opcional
}
```

#### Habilitar/Inhabilitar Usuario (Admin)
```http
PATCH /api/usuarios/{id}/estado
Authorization: Bearer {token_admin}
Content-Type: application/json

{
  "activo": false  // true = habilitar, false = inhabilitar
}
```

---

### 📦 Productos

#### Listar Productos
```http
GET /api/productos
```

#### Obtener Producto por ID
```http
GET /api/productos/{id}
```

#### Crear Producto (Admin)
```http
POST /api/productos
Authorization: Bearer {token_admin}
Content-Type: application/json

{
  "nombre": "Laptop HP",
  "descripcion": "Laptop HP 15.6 pulgadas",
  "precio": 899.99,
  "stock": 50
}
```

#### Actualizar Producto (Admin)
```http
PUT /api/productos/{id}
Authorization: Bearer {token_admin}
Content-Type: application/json

{
  "nombre": "Laptop HP Actualizada",
  "precio": 799.99,
  "stock": 45
}
```

#### Eliminar Producto (Admin)
```http
DELETE /api/productos/{id}
Authorization: Bearer {token_admin}
```

---

### 🛒 Carrito y Compras

#### Agregar Producto al Carrito
```http
POST /api/carrito/agregar
Authorization: Bearer {token}
Content-Type: application/json

{
  "productoId": 1,
  "cantidad": 2
}
```

> **Nota:** Esto reserva el stock por **3 días**. Si no completas la compra en ese tiempo, la reserva expira.

#### Finalizar Compra
```http
POST /api/carrito/comprar
Authorization: Bearer {token}
Content-Type: application/json

{
  "articulos": [
    {
      "productoId": 1,
      "cantidad": 2,
      "nombre": "Laptop HP",
      "precio": 899.99
    },
    {
      "productoId": 2,
      "cantidad": 1,
      "nombre": "Mouse Logitech",
      "precio": 29.99
    }
  ]
}

# Respuesta:
{
  "id": "67b3c4d5e6f7g8h9i0j1k2l3",
  "usuarioId": 1,
  "total": 1829.97,
  "productos": [...],
  "fecha": "2026-02-24T10:30:00.000Z"
}
```

---

### 🧾 Facturas

#### Ver Mis Facturas
```http
GET /api/facturas/mis-facturas
Authorization: Bearer {token}
```

#### Listar Todas las Facturas (Admin)
```http
GET /api/facturas
Authorization: Bearer {token_admin}
```

---

## 🎯 Uso Paso a Paso

### Flujo Completo de Usuario

#### 1️⃣ Registrar una Cuenta
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "María García",
    "email": "maria@correo.com",
    "clave": "password123"
  }'
```

#### 2️⃣ Iniciar Sesión
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@correo.com",
    "clave": "password123"
  }'

# Guarda el token de la respuesta
```

#### 3️⃣ Ver Productos Disponibles
```bash
curl -X GET http://localhost:3000/api/productos
```

#### 4️⃣ Reservar Productos (Agregar al Carrito)
```bash
curl -X POST http://localhost:3000/api/carrito/agregar \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productoId": 1,
    "cantidad": 2
  }'
```

#### 5️⃣ Finalizar Compra
```bash
curl -X POST http://localhost:3000/api/carrito/comprar \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "articulos": [
      {
        "productoId": 1,
        "cantidad": 2,
        "nombre": "Producto 1",
        "precio": 50.00
      }
    ]
  }'
```

#### 6️⃣ Ver Mis Facturas
```bash
curl -X GET http://localhost:3000/api/facturas/mis-facturas \
  -H "Authorization: Bearer TU_TOKEN"
```

#### 7️⃣ Actualizar Mi Perfil
```bash
curl -X PUT http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "María García Actualizado",
    "email": "maria.nueva@correo.com"
  }'
```

---

### Flujo de Administrador

#### 1️⃣ Promover Usuario a Admin (Vía Base de Datos)

**En Windows (PowerShell):**
```powershell
docker exec -it pg_usuarios psql -U postgres -d usuarios_db -c "UPDATE \"Usuario\" SET rol = 'ADMIN' WHERE email = 'admin@correo.com';"
```

**En Linux/Mac:**
```bash
docker exec -it pg_usuarios psql -U postgres -d usuarios_db -c "UPDATE \"Usuario\" SET rol = 'ADMIN' WHERE email = 'admin@correo.com';"
```

#### 2️⃣ Crear Producto
```bash
curl -X POST http://localhost:3000/api/productos \
  -H "Authorization: Bearer TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Laptop Dell",
    "descripcion": "Laptop empresarial",
    "precio": 1299.99,
    "stock": 30
  }'
```

#### 3️⃣ Listar Todos los Usuarios
```bash
curl -X GET http://localhost:3000/api/usuarios \
  -H "Authorization: Bearer TOKEN_ADMIN"
```

#### 4️⃣ Inhabilitar Usuario
```bash
curl -X PATCH http://localhost:3000/api/usuarios/5/estado \
  -H "Authorization: Bearer TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "activo": false
  }'
```

#### 5️⃣ Actualizar Usuario
```bash
curl -X PUT http://localhost:3000/api/usuarios/5 \
  -H "Authorization: Bearer TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Nombre Modificado",
    "rol": "ADMIN",
    "activo": true
  }'
```

#### 6️⃣ Ver Todas las Facturas
```bash
curl -X GET http://localhost:3000/api/facturas \
  -H "Authorization: Bearer TOKEN_ADMIN"
```

---

## 🔒 Roles y Permisos

| Endpoint | USER | ADMIN |
|----------|------|-------|
| `POST /auth/register` | ✅ | ✅ |
| `POST /auth/login` | ✅ | ✅ |
| `GET /auth/profile` | ✅ | ✅ |
| `PUT /auth/profile` | ✅ (solo su perfil) | ✅ (solo su perfil) |
| `GET /usuarios` | ❌ | ✅ |
| `PUT /usuarios/:id` | ❌ | ✅ |
| `PATCH /usuarios/:id/estado` | ❌ | ✅ |
| `GET /productos` | ✅ | ✅ |
| `POST /productos` | ❌ | ✅ |
| `PUT /productos/:id` | ❌ | ✅ |
| `DELETE /productos/:id` | ❌ | ✅ |
| `POST /carrito/agregar` | ✅ | ✅ |
| `POST /carrito/comprar` | ✅ | ✅ |
| `GET /facturas/mis-facturas` | ✅ | ✅ |
| `GET /facturas` | ❌ | ✅ |

---

## 🌍 Variables de Entorno

Las variables de entorno están configuradas en el archivo `docker-compose.yml`:

### API Gateway
```yaml
PORT: 3000
JWT_SECRET: tu_clave_secreta_super_segura
```

### Usuarios MS (PostgreSQL)
```yaml
DATABASE_URL: postgresql://postgres:postgres@pg_usuarios:5432/usuarios_db
```

### Productos MS (MySQL)
```yaml
DB_HOST: mysql_productos
DB_PORT: 3306
DB_USERNAME: root
DB_PASSWORD: root
DB_DATABASE: productos_db
```

### Facturas MS (MongoDB)
```yaml
DATABASE_URL: mongodb://mongo_facturas:27017/facturas_db
```

---

## 🛠️ Solución de Problemas

### Los contenedores no inician

```bash
# Ver errores detallados
docker-compose logs

# Eliminar contenedores y volver a construir
docker-compose down
docker-compose up --build -d
```

### Error de conexión a base de datos

```bash
# Reiniciar las bases de datos
docker-compose restart pg_usuarios mysql_productos mongo_facturas

# Verificar que las bases de datos estén corriendo
docker-compose ps | grep -E "pg_usuarios|mysql_productos|mongo_facturas"
```

### Error 401 Unauthorized

- Verifica que el token JWT sea válido
- Asegúrate de incluir el header: `Authorization: Bearer {token}`
- Verifica que el token no haya expirado (10 horas de validez)

### Error 403 Forbidden

- Verifica que tu usuario tenga el rol correcto (ADMIN para endpoints administrativos)
- Revisa los logs del gateway: `docker logs ms-gateway`

### Puerto 3000 ya está en uso

```bash
# En Windows
netstat -ano | findstr :3000
taskkill /PID {PID} /F

# En Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Resetear completamente el proyecto

```bash
# ADVERTENCIA: Esto borrará todos los datos
docker-compose down -v
docker-compose up --build -d
```

### Ver logs en tiempo real
```bash
docker-compose logs -f
```

---

## 📚 Recursos Adicionales

- **Documentación Swagger:** http://localhost:3000/docs
- **Prisma Studio (Usuarios):** `docker exec -it ms-usuarios npx prisma studio`
- **NestJS Docs:** https://docs.nestjs.com
- **Docker Docs:** https://docs.docker.com

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

## 👨‍💻 Autor

Desarrollado para demostrar arquitectura de microservicios con NestJS.

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

**¡Disfruta construyendo con microservicios! 🎉**
