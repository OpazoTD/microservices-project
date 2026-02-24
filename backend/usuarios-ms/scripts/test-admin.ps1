# Script de prueba para verificar acceso de usuario ADMIN

Write-Host "`n🔐 Probando autenticación del usuario ADMIN..." -ForegroundColor Cyan
Write-Host "================================================`n" -ForegroundColor Cyan

# 1. Login
Write-Host "1️⃣  Haciendo login con admin@correo.com..." -ForegroundColor Yellow
$loginBody = @{ 
    email = 'admin@correo.com'
    clave = 'admin1234' 
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/login' -Method POST -Body $loginBody -ContentType 'application/json'
    $token = $loginResponse.access_token
    Write-Host "✅ Login exitoso!" -ForegroundColor Green
    Write-Host "   Token: $($token.Substring(0,50))..." -ForegroundColor Gray
    
    # 2. Obtener perfil
    Write-Host "`n2️⃣  Obteniendo perfil..." -ForegroundColor Yellow
    $headers = @{
        'Authorization' = "Bearer $token"
    }
    $profile = Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/profile' -Method GET -Headers $headers
    Write-Host "✅ Perfil obtenido:" -ForegroundColor Green
    Write-Host "   ID: $($profile.id)" -ForegroundColor Gray
    Write-Host "   Nombre: $($profile.nombre)" -ForegroundColor Gray
    Write-Host "   Email: $($profile.email)" -ForegroundColor Gray
    Write-Host "   Rol: $($profile.role)" -ForegroundColor Magenta
    
    # 3. Listar todos los usuarios (solo ADMIN)
    Write-Host "`n3️⃣  Listando todos los usuarios (endpoint ADMIN)..." -ForegroundColor Yellow
    $usuarios = Invoke-RestMethod -Uri 'http://localhost:3000/api/usuarios' -Method GET -Headers $headers
    Write-Host "✅ Usuarios obtenidos: $($usuarios.Count)" -ForegroundColor Green
    
    Write-Host "`n================================================" -ForegroundColor Cyan
    Write-Host "🎉 ¡Usuario ADMIN verificado correctamente!" -ForegroundColor Green
    Write-Host "`n📋 Credenciales:" -ForegroundColor Yellow
    Write-Host "   Email: admin@correo.com" -ForegroundColor White
    Write-Host "   Password: admin1234" -ForegroundColor White
    Write-Host "   Rol: ADMIN ✓" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host $_.Exception.Response.StatusCode -ForegroundColor Red
}
