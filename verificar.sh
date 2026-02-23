#!/bin/bash
# Script de Verificación - Microservicios Project
# Este script verifica que todos los servicios estén correctamente configurados

echo "================================"
echo "  Verificación de Microservicios"
echo "================================"
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para verificar si un archivo existe
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 existe"
        return 0
    else
        echo -e "${RED}✗${NC} $1 NO existe"
        return 1
    fi
}

# Función para verificar si una cadena existe en un archivo
check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $1 contiene: '$2'"
        return 0
    else
        echo -e "${RED}✗${NC} $1 NO contiene: '$2'"
        return 1
    fi
}

echo ""
echo "1️⃣  Verificando Dockerfiles..."
echo "================================"
check_file "backend/api-gateway/Dockerfile"
check_file "backend/usuarios-ms/Dockerfile"
check_file "backend/productos-ms/Dockerfile"
check_file "backend/facturas-ms/Dockerfile"

echo ""
echo "2️⃣  Verificando Puerto Expose en Productos MS Dockerfile..."
echo "=========================================================="
check_content "backend/productos-ms/Dockerfile" "EXPOSE 3002 3004"
check_content "backend/productos-ms/Dockerfile" "ENV MS_TCP_PORT=3004"

echo ""
echo "3️⃣  Verificando Docker Compose..."
echo "=================================="
check_file "docker-compose.yml"
check_content "docker-compose.yml" "MS_PRODUCT_PORT: 3004"
check_content "docker-compose.yml" "MS_INVOICE_PORT: 3003"

echo ""
echo "4️⃣  Verificando Módulos de Gateway..."
echo "===================================="
check_file "backend/api-gateway/src/carrito/carrito.module.ts"
check_content "backend/api-gateway/src/carrito/carrito.module.ts" "ConfigService"
check_content "backend/api-gateway/src/carrito/carrito.module.ts" "MS_PRODUCT_HOST"

echo ""
echo "5️⃣  Verificando Handlers en Controladores..."
echo "============================================"
check_content "backend/productos-ms/src/productos/productos.controller.ts" "reservar_stock"
check_content "backend/productos-ms/src/productos/productos.controller.ts" "confirmar_compra"
check_content "backend/facturas-ms/src/app.controller.ts" "agregar_item_carrito"
check_content "backend/facturas-ms/src/app.controller.ts" "obtener_facturas_usuario"

echo ""
echo "6️⃣  Verificando Comandos en Español..."
echo "======================================"
check_content "backend/api-gateway/src/usuarios/usuarios.controller.ts" "crear_usuario"
check_content "backend/api-gateway/src/usuarios/usuarios.controller.ts" "obtener_usuarios"
check_content "backend/api-gateway/src/productos/productos.controller.ts" "obtener_productos"
check_content "backend/api-gateway/src/facturas/facturas.controller.ts" "obtener_facturas_usuario"

echo ""
echo "================================"
echo "  Verificación Completada ✅"
echo "================================"
echo ""
echo "Para iniciar los servicios ejecuta:"
echo "  docker-compose down -v  (si es necesario limpiar)"
echo "  docker-compose up -d --build"
echo ""
echo "Puertos esperados:"
echo "  API Gateway:     http://localhost:3000"
echo "  Swagger Docs:    http://localhost:3000/docs"
echo "  Usuarios MS:     localhost:3001 (TCP)"
echo "  Productos MS:    localhost:3002 (HTTP) / 3004 (TCP)"
echo "  Facturas MS:     localhost:3003 (TCP)"
echo ""
