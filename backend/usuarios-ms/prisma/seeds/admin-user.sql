-- Script de inicialización para crear/actualizar usuario ADMIN
-- Este script se puede ejecutar múltiples veces de forma segura

-- Actualizar usuario admin existente a rol ADMIN si existe
UPDATE "Usuario" 
SET 
  rol = 'ADMIN',
  activo = true,
  "updatedAt" = NOW()
WHERE email = 'admin@correo.com';

-- Mostrar resultado
DO $$
DECLARE
  usuario_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO usuario_count FROM "Usuario" WHERE email = 'admin@correo.com';
  
  IF usuario_count > 0 THEN
    RAISE NOTICE '✅ Usuario admin@correo.com promovido a rol ADMIN';
  ELSE
    RAISE NOTICE '⚠️  Usuario admin@correo.com no encontrado';
  END IF;
END $$;
