#!/usr/bin/env node

/**
 * Script para verificar headers de seguridad
 * Verifica que todos los headers de seguridad estén presentes y correctos
 */

const https = require('https');
const http = require('http');

const TARGET_URL = process.env.TARGET_URL || 'http://localhost:3000';

// Headers de seguridad requeridos
const REQUIRED_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

// Headers opcionales pero recomendados
const OPTIONAL_HEADERS = [
  'Content-Security-Policy',
  'Strict-Transport-Security'
];

async function checkHeaders(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      const headers = res.headers;
      const results = {
        url,
        statusCode: res.statusCode,
        required: {},
        optional: {},
        missing: [],
        incorrect: [],
        score: 0,
        total: Object.keys(REQUIRED_HEADERS).length + OPTIONAL_HEADERS.length
      };

      // Verificar headers requeridos
      for (const [header, expectedValue] of Object.entries(REQUIRED_HEADERS)) {
        const actualValue = headers[header.toLowerCase()];
        
        if (!actualValue) {
          results.missing.push(header);
          results.required[header] = { status: 'MISSING', expected: expectedValue };
        } else if (actualValue !== expectedValue) {
          results.incorrect.push(`${header}: expected "${expectedValue}", got "${actualValue}"`);
          results.required[header] = { status: 'INCORRECT', expected: expectedValue, actual: actualValue };
        } else {
          results.required[header] = { status: 'OK', value: actualValue };
          results.score++;
        }
      }

      // Verificar headers opcionales
      for (const header of OPTIONAL_HEADERS) {
        const value = headers[header.toLowerCase()];
        if (value) {
          results.optional[header] = { status: 'PRESENT', value };
          results.score++;
        } else {
          results.optional[header] = { status: 'MISSING' };
        }
      }

      resolve(results);
    }).on('error', reject);
  });
}

async function runHeaderCheck() {
  console.log('🔒 Verificando headers de seguridad...');
  console.log(`🎯 URL objetivo: ${TARGET_URL}`);
  console.log('');

  // Probar múltiples rutas para verificar headers
  const testUrls = [
    `${TARGET_URL}/api/denuncias`,
    `${TARGET_URL}/api/alertas`,
    `${TARGET_URL}/api/auth/signin`,
    `${TARGET_URL}/admin`
  ];

  let allResults = [];
  let totalScore = 0;
  let totalTests = 0;

  for (const url of testUrls) {
    try {
      console.log(`🔍 Probando: ${url}`);
      const results = await checkHeaders(url);
      allResults.push(results);
      totalScore += results.score;
      totalTests += results.total;
      
      console.log(`   📊 Puntuación: ${results.score}/${results.total} (${Math.round(results.score/results.total*100)}%)`);
      
      // Mostrar headers que faltan para esta URL
      if (results.missing.length > 0) {
        console.log(`   ❌ Headers faltantes: ${results.missing.join(', ')}`);
      }
      
      console.log('');
    } catch (error) {
      console.log(`   ⚠️ Error probando ${url}: ${error.message}`);
      console.log('');
    }
  }

  // Resumen general
  console.log('📊 RESUMEN GENERAL:');
  console.log('==================');
  console.log(`📈 Puntuación promedio: ${Math.round(totalScore/totalTests*100)}%`);
  console.log(`🔍 URLs probadas: ${testUrls.length}`);
  console.log('');

  // Mostrar headers requeridos (usando el primer resultado exitoso)
  const successfulResult = allResults.find(r => r.score > 0);
  if (successfulResult) {
    console.log('🔴 Headers Requeridos:');
    for (const [header, info] of Object.entries(successfulResult.required)) {
      const status = info.status === 'OK' ? '✅' : info.status === 'MISSING' ? '❌' : '⚠️';
      console.log(`  ${status} ${header}: ${info.status}`);
      if (info.status !== 'OK') {
        console.log(`     Esperado: ${info.expected}`);
        if (info.actual) {
          console.log(`     Actual: ${info.actual}`);
        }
      }
    }
    console.log('');

    // Mostrar headers opcionales
    console.log('🟡 Headers Opcionales:');
    for (const [header, info] of Object.entries(successfulResult.optional)) {
      const status = info.status === 'PRESENT' ? '✅' : '⚠️';
      console.log(`  ${status} ${header}: ${info.status}`);
      if (info.status === 'PRESENT') {
        console.log(`     Valor: ${info.value.substring(0, 100)}${info.value.length > 100 ? '...' : ''}`);
      }
    }
    console.log('');
  }

  // Recomendaciones
  console.log('💡 RECOMENDACIONES:');
  const averageScore = totalScore / totalTests;
  if (averageScore >= 0.9) {
    console.log('✅ Excelente! Los headers de seguridad están configurados correctamente.');
  } else if (averageScore >= 0.7) {
    console.log('🟡 Bueno! La mayoría de los headers están configurados. Revisa los faltantes.');
  } else {
    console.log('🔴 Necesita mejora! Faltan varios headers de seguridad importantes.');
  }

  // Verificar HTTPS
  if (!TARGET_URL.startsWith('https')) {
    console.log('⚠️ Considera usar HTTPS en producción para mayor seguridad.');
  }

  return averageScore >= 0.8;
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  runHeaderCheck().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { runHeaderCheck, checkHeaders }; 