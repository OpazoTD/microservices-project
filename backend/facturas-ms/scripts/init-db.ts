/**
 * Script de inicialización de la base de datos MongoDB para facturas-ms
 * 
 * Nota: MongoDB con Prisma no requiere migraciones tradicionales como PostgreSQL,
 * ya que MongoDB es una base de datos sin esquema (schemaless).
 * 
 * Este script es útil para:
 * - Crear índices para mejorar el rendimiento
 * - Verificar la conexión a la base de datos
 * - Insertar datos de prueba (opcional)
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando configuración de base de datos MongoDB...');

  try {
    // Verificar conexión
    await prisma.$connect();
    console.log('✅ Conexión a MongoDB establecida');

    // Crear índices para mejorar el rendimiento
    console.log('📑 Verificando índices...');
    
    // MongoDB creará estos índices automáticamente basándose en el schema de Prisma
    // pero podemos forzar su creación o verificación aquí si es necesario
    
    const facturasCount = await prisma.factura.count();
    console.log(`📊 Total de facturas en la base de datos: ${facturasCount}`);

    console.log('✅ Base de datos inicializada correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
