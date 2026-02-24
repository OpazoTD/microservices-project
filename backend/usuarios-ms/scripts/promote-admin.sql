-- Script para promover usuario a ADMIN
-- Usuario: admin@correo.com

UPDATE "Usuario" 
SET 
  rol = 'ADMIN',
  activo = true,
  "updatedAt" = NOW()
WHERE email = 'admin@correo.com';

-- Verificar el cambio
SELECT id, nombre, email, rol, activo, "createdAt", "updatedAt" 
FROM "Usuario" 
WHERE email = 'admin@correo.com';
