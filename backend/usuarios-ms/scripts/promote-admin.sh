#!/bin/bash
# Script para promover el usuario admin a rol ADMIN

echo "🔧 Promoviendo usuario admin@correo.com a rol ADMIN..."

docker exec ms-postgres psql -U admin -d usuarios_db -c "
UPDATE \"Usuario\" 
SET 
  rol = 'ADMIN',
  activo = true,
  \"updatedAt\" = NOW()
WHERE email = 'admin@correo.com';
"

echo "✅ Usuario actualizado. Verificando cambios..."

docker exec ms-postgres psql -U admin -d usuarios_db -c "
SELECT id, nombre, email, rol, activo 
FROM \"Usuario\" 
WHERE email = 'admin@correo.com';
"

echo "✅ ¡Listo! El usuario admin@correo.com ahora tiene rol ADMIN"
