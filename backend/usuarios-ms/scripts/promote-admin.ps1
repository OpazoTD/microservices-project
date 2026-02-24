# Script PowerShell para promover el usuario admin a rol ADMIN

Write-Host "🔧 Promoviendo usuario admin@correo.com a rol ADMIN..." -ForegroundColor Cyan

docker exec ms-postgres psql -U admin -d usuarios_db -c "UPDATE `"Usuario`" SET rol = 'ADMIN', activo = true, `"updatedAt`" = NOW() WHERE email = 'admin@correo.com';"

Write-Host "✅ Usuario actualizado. Verificando cambios..." -ForegroundColor Green

docker exec ms-postgres psql -U admin -d usuarios_db -c "SELECT id, nombre, email, rol, activo FROM `"Usuario`" WHERE email = 'admin@correo.com';"

Write-Host "`n✅ ¡Listo! El usuario admin@correo.com ahora tiene rol ADMIN" -ForegroundColor Green
Write-Host "`n📋 Credenciales:" -ForegroundColor Yellow
Write-Host "   Email: admin@correo.com" -ForegroundColor White
Write-Host "   Password: admin1234" -ForegroundColor White
Write-Host "   Rol: ADMIN" -ForegroundColor White
