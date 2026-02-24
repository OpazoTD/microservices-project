# 🛒 Documentación API - Flujo de Compra

## Base URL
```
http://localhost:3000/api
```

## Autenticación
Todos los endpoints de carrito requieren autenticación JWT.

**Header requerido:**
```
Authorization: Bearer <tu_token_jwt>
```

---

## 📋 Flujo Completo de Compra

### Paso 1: Login del Usuario

#### `POST /api/auth/login`

**Request:**
```json
{
  "email": "usuario@correo.com",
  "clave": "contraseña123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Ejemplo JavaScript:**
```javascript
const login = async () => {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'usuario@correo.com',
      clave: 'contraseña123'
    })
  });
  
  const data = await response.json();
  localStorage.setItem('token', data.access_token);
  return data.access_token;
};
```

---

### Paso 2: Obtener Productos Disponibles

#### `GET /api/productos`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "nombre": "Laptop HP",
    "descripcion": "Laptop potente para trabajo",
    "precio": 999.99,
    "stock": 25,
    "imagenUrl": "https://ejemplo.com/laptop.jpg"
  },
  {
    "id": 2,
    "nombre": "Mouse Logitech",
    "descripcion": "Mouse inalámbrico",
    "precio": 29.99,
    "stock": 100,
    "imagenUrl": "https://ejemplo.com/mouse.jpg"
  }
]
```

**Ejemplo JavaScript:**
```javascript
const getProductos = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3000/api/productos', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
};
```

---

### Paso 3: Agregar Productos al Carrito (Reservar Stock)

#### `POST /api/carrito/agregar`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "productoId": 1,
  "cantidad": 2
}
```

**Response:**
```json
{
  "success": true,
  "reservaId": 123,
  "productoId": 1,
  "cantidad": 2,
  "mensaje": "Producto reservado y agregado al carrito"
}
```

**Notas importantes:**
- ⏰ La reserva dura **3 días**
- 🔒 El stock queda bloqueado para otros usuarios
- ✅ Guarda el `reservaId` para usarlo en la compra final

**Ejemplo JavaScript:**
```javascript
const agregarAlCarrito = async (productoId, cantidad) => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3000/api/carrito/agregar', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      productoId: productoId,
      cantidad: cantidad
    })
  });
  
  return await response.json();
};

// Ejemplo de uso:
// const reserva = await agregarAlCarrito(1, 2); // Producto 1, cantidad 2
// Guarda reserva.reservaId para usarlo después
```

---

### Paso 4: Finalizar Compra (Checkout)

#### `POST /api/carrito/comprar`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "articulos": [
    {
      "productoId": 1,
      "nombre": "Laptop HP",
      "cantidad": 2,
      "precioUnit": 999.99,
      "reservaId": 123
    },
    {
      "productoId": 2,
      "nombre": "Mouse Logitech",
      "cantidad": 3,
      "precioUnit": 29.99,
      "reservaId": 124
    }
  ],
  "montoTotal": 2089.95
}
```

**Campos requeridos por artículo:**
- ✅ `productoId` (number): ID del producto
- ✅ `nombre` (string): Nombre del producto
- ✅ `cantidad` (number): Cantidad a comprar
- ✅ `precioUnit` (number): Precio unitario
- 🔹 `reservaId` (number, opcional): ID de la reserva (recomendado)

**Campos opcionales:**
- 🔹 `montoTotal` (number): Total calculado (si no se envía, se calcula automáticamente)

**Response:**
```json
{
  "id": "65f8a1234567890abcdef012",
  "usuarioId": "2",
  "nombreUser": "Juan Pérez",
  "emailUser": "juan@correo.com",
  "total": 2089.95,
  "productos": [
    {
      "productoId": "1",
      "nombre": "Laptop HP",
      "cantidad": 2,
      "precioUnit": 999.99,
      "subtotal": 1999.98
    },
    {
      "productoId": "2",
      "nombre": "Mouse Logitech",
      "cantidad": 3,
      "precioUnit": 29.99,
      "subtotal": 89.97
    }
  ],
  "estado": "COMPLETADA",
  "createdAt": "2026-02-24T04:45:00.000Z",
  "updatedAt": "2026-02-24T04:45:00.000Z"
}
```

**Ejemplo JavaScript:**
```javascript
const finalizarCompra = async (carrito) => {
  const token = localStorage.getItem('token');
  
  // Formatear datos según el DTO esperado
  const payload = {
    articulos: carrito.map(item => ({
      productoId: item.productoId,
      nombre: item.nombre,
      cantidad: item.cantidad,
      precioUnit: item.precio,
      reservaId: item.reservaId // Importante: incluir el reservaId de la reserva previa
    })),
    montoTotal: carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
  };
  
  const response = await fetch('http://localhost:3000/api/carrito/comprar', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al finalizar compra');
  }
  
  return await response.json();
};
```

---

### Paso 5: Ver Mis Facturas

#### `GET /api/facturas/mis-facturas`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "65f8a1234567890abcdef012",
    "usuarioId": "2",
    "nombreUser": "Juan Pérez",
    "emailUser": "juan@correo.com",
    "total": 2089.95,
    "productos": [...],
    "estado": "COMPLETADA",
    "createdAt": "2026-02-24T04:45:00.000Z"
  }
]
```

**Ejemplo JavaScript:**
```javascript
const getMisFacturas = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3000/api/facturas/mis-facturas', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
};
```

---

## 🎯 Ejemplo Completo: Flujo de Compra en JavaScript

```javascript
class CarritoService {
  constructor() {
    this.baseUrl = 'http://localhost:3000/api';
    this.carrito = []; // Array local para manejar el carrito en frontend
  }

  // 1. Login
  async login(email, clave) {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, clave })
    });
    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    return data;
  }

  // 2. Obtener productos
  async getProductos() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseUrl}/productos`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  }

  // 3. Agregar al carrito (reservar stock)
  async agregarAlCarrito(producto, cantidad) {
    const token = localStorage.getItem('token');
    
    // Reservar stock en backend
    const response = await fetch(`${this.baseUrl}/carrito/agregar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productoId: producto.id,
        cantidad: cantidad
      })
    });
    
    const reserva = await response.json();
    
    // Guardar en carrito local con el reservaId
    this.carrito.push({
      productoId: producto.id,
      nombre: producto.nombre,
      cantidad: cantidad,
      precio: producto.precio,
      reservaId: reserva.reservaId // ¡Importante!
    });
    
    return reserva;
  }

  // 4. Finalizar compra
  async finalizarCompra() {
    const token = localStorage.getItem('token');
    
    const payload = {
      articulos: this.carrito.map(item => ({
        productoId: item.productoId,
        nombre: item.nombre,
        cantidad: item.cantidad,
        precioUnit: item.precio,
        reservaId: item.reservaId
      })),
      montoTotal: this.carrito.reduce((sum, item) => 
        sum + (item.precio * item.cantidad), 0
      )
    };
    
    const response = await fetch(`${this.baseUrl}/carrito/comprar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error('Error al procesar la compra');
    }
    
    const factura = await response.json();
    
    // Limpiar carrito después de compra exitosa
    this.carrito = [];
    
    return factura;
  }

  // Ver facturas
  async getMisFacturas() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseUrl}/facturas/mis-facturas`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  }
}

// Uso:
const carritoService = new CarritoService();

// Login
await carritoService.login('usuario@correo.com', 'contraseña123');

// Ver productos
const productos = await carritoService.getProductos();

// Agregar al carrito
await carritoService.agregarAlCarrito(productos[0], 2); // 2 unidades
await carritoService.agregarAlCarrito(productos[1], 1); // 1 unidad

// Finalizar compra
const factura = await carritoService.finalizarCompra();
console.log('Compra realizada:', factura);

// Ver mis compras
const misFacturas = await carritoService.getMisFacturas();
```

---

## ⚠️ Manejo de Errores

### Errores Comunes:

**401 Unauthorized**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```
➡️ Token inválido o expirado. Volver a hacer login.

**400 Bad Request**
```json
{
  "message": ["articulos must be an array"],
  "error": "Bad Request",
  "statusCode": 400
}
```
➡️ Datos inválidos. Revisar la estructura del request.

**500 Internal Server Error**
```json
{
  "status": "error",
  "message": "Internal server error"
}
```
➡️ Error en el servidor. Revisar logs con `docker logs ms-facturas --tail 50`

---

## 🔧 Testing con cURL

### Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@correo.com","clave":"admin1234"}'
```

### Agregar al carrito:
```bash
curl -X POST http://localhost:3000/api/carrito/agregar \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"productoId":1,"cantidad":2}'
```

### Finalizar compra:
```bash
curl -X POST http://localhost:3000/api/carrito/comprar \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "articulos": [
      {
        "productoId": 1,
        "nombre": "Laptop HP",
        "cantidad": 2,
        "precioUnit": 999.99,
        "reservaId": 123
      }
    ],
    "montoTotal": 1999.98
  }'
```

---

## 📝 Notas Importantes

1. **Reservas de stock**: Duran 3 días. Después expiran automáticamente.
2. **reservaId**: Aunque es opcional, enviarlo garantiza que se descuente el stock correcto.
3. **Token JWT**: Se obtiene al hacer login y debe incluirse en TODAS las peticiones.
4. **Validación**: El backend valida automáticamente la estructura de datos.
5. **Stock**: Se actualiza automáticamente al completar la compra.

---

## 🎨 Swagger Documentation

Puedes ver la documentación interactiva en:
```
http://localhost:3000/docs
```

Ahí puedes probar todos los endpoints directamente desde el navegador.
