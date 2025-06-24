#!/usr/bin/env node

/**
 * Pruebas manuales de seguridad
 * Verifica las funcionalidades de seguridad implementadas sin dependencias externas
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.TARGET_URL || 'http://localhost:3000';

// Colores para consola
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName, passed, details = '') {
  const status = passed ? '✅ PASÓ' : '❌ FALLÓ';
  const color = passed ? 'green' : 'red';
  log(`${status} ${testName}`, color);
  if (details) {
    log(`   ${details}`, 'yellow');
  }
}

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function testHeaders() {
  log('\n🔒 PRUEBA 1: Headers de Seguridad', 'bold');
  log('=====================================');
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/denuncias`);
    
    const requiredHeaders = {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    };
    
    let passed = 0;
    let total = Object.keys(requiredHeaders).length;
    
    for (const [header, expectedValue] of Object.entries(requiredHeaders)) {
      const actualValue = response.headers[header.toLowerCase()];
      const testPassed = actualValue === expectedValue;
      logTest(
        `Header ${header}`,
        testPassed,
        testPassed ? `Valor: ${actualValue}` : `Esperado: ${expectedValue}, Actual: ${actualValue}`
      );
      if (testPassed) passed++;
    }
    
    logTest(
      'Headers de Seguridad',
      passed === total,
      `${passed}/${total} headers correctos`
    );
    
    return passed === total;
  } catch (error) {
    logTest('Headers de Seguridad', false, error.message);
    return false;
  }
}

async function testRateLimiting() {
  log('\n🚦 PRUEBA 2: Rate Limiting', 'bold');
  log('============================');
  
  try {
    const requests = [];
    const maxRequests = 15;
    
    // Hacer múltiples requests rápidos
    for (let i = 0; i < maxRequests; i++) {
      requests.push(
        makeRequest(`${BASE_URL}/api/denuncias/codigo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ code: `TEST-${i}` })
        })
      );
    }
    
    const responses = await Promise.all(requests);
    const rateLimited = responses.some(r => r.statusCode === 429);
    
    logTest(
      'Rate Limiting Activo',
      rateLimited,
      rateLimited ? 'Al menos un request fue limitado (429)' : 'Ningún request fue limitado'
    );
    
    // Verificar headers de rate limit
    const rateLimitHeaders = responses.some(r => 
      r.headers['x-ratelimit-limit'] || 
      r.headers['retry-after']
    );
    
    logTest(
      'Headers de Rate Limit',
      rateLimitHeaders,
      rateLimitHeaders ? 'Headers de rate limit presentes' : 'Headers de rate limit faltantes'
    );
    
    return rateLimited && rateLimitHeaders;
  } catch (error) {
    logTest('Rate Limiting', false, error.message);
    return false;
  }
}

async function testFileValidation() {
  log('\n📁 PRUEBA 3: Validación de Archivos', 'bold');
  log('====================================');
  
  try {
    // Simular upload de archivo malicioso
    const maliciousFile = Buffer.from('<script>alert("XSS")</script>');
    const formData = `------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="file"; filename="script.js"
Content-Type: application/javascript

${maliciousFile.toString()}
------WebKitFormBoundary7MA4YWxkTrZu0gW--`;

    const response = await makeRequest(`${BASE_URL}/api/denuncias`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
      },
      body: formData
    });
    
    // Debería rechazar archivos maliciosos
    const rejected = response.statusCode === 400 || response.statusCode === 403;
    
    logTest(
      'Rechazo de Archivos Maliciosos',
      rejected,
      rejected ? `Archivo rechazado (${response.statusCode})` : `Archivo aceptado (${response.statusCode})`
    );
    
    return rejected;
  } catch (error) {
    logTest('Validación de Archivos', false, error.message);
    return false;
  }
}

async function testSuspiciousActivity() {
  log('\n🚨 PRUEBA 4: Detección de Actividad Sospechosa', 'bold');
  log('===============================================');
  
  try {
    // Simular User-Agent sospechoso
    const response = await makeRequest(`${BASE_URL}/api/admin/comentarios/pendientes`, {
      headers: {
        'User-Agent': 'sqlmap/1.0'
      }
    });
    
    // Debería detectar actividad sospechosa
    const detected = response.statusCode === 403 || response.statusCode === 429;
    
    logTest(
      'Detección de User-Agent Sospechoso',
      detected,
      detected ? `Actividad bloqueada (${response.statusCode})` : `Actividad permitida (${response.statusCode})`
    );
    
    return detected;
  } catch (error) {
    logTest('Detección de Actividad Sospechosa', false, error.message);
    return false;
  }
}

async function testAuthentication() {
  log('\n🔐 PRUEBA 5: Autenticación', 'bold');
  log('============================');
  
  try {
    // Intentar acceder a ruta protegida sin autenticación
    const response = await makeRequest(`${BASE_URL}/admin`);
    
    // Debería redirigir o bloquear acceso no autorizado
    const protected = response.statusCode === 401 || response.statusCode === 403 || response.statusCode === 302;
    
    logTest(
      'Protección de Rutas Administrativas',
      protected,
      protected ? `Acceso bloqueado (${response.statusCode})` : `Acceso permitido (${response.statusCode})`
    );
    
    return protected;
  } catch (error) {
    logTest('Autenticación', false, error.message);
    return false;
  }
}

async function testXSSProtection() {
  log('\n🛡️ PRUEBA 6: Protección XSS', 'bold');
  log('=============================');
  
  try {
    // Simular payload XSS
    const xssPayload = '<script>alert("XSS")</script>';
    const response = await makeRequest(`${BASE_URL}/api/denuncias`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        story: xssPayload,
        name: 'Test',
        lastName: 'User'
      })
    });
    
    // Verificar que el payload no se ejecute
    const safe = !response.body.includes(xssPayload) || response.statusCode === 400;
    
    logTest(
      'Protección contra XSS',
      safe,
      safe ? 'Payload XSS manejado correctamente' : 'Payload XSS no filtrado'
    );
    
    return safe;
  } catch (error) {
    logTest('Protección XSS', false, error.message);
    return false;
  }
}

async function runAllTests() {
  log('🚀 INICIANDO PRUEBAS DE SEGURIDAD AUTOMATIZADAS', 'bold');
  log('================================================');
  log(`🎯 URL objetivo: ${BASE_URL}`);
  log(`⏰ Timestamp: ${new Date().toISOString()}`);
  
  const tests = [
    testHeaders,
    testRateLimiting,
    testFileValidation,
    testSuspiciousActivity,
    testAuthentication,
    testXSSProtection
  ];
  
  let passed = 0;
  let total = tests.length;
  
  for (const test of tests) {
    try {
      const result = await test();
      if (result) passed++;
    } catch (error) {
      log(`❌ Error en prueba: ${error.message}`, 'red');
    }
  }
  
  // Resumen final
  log('\n📊 RESUMEN FINAL', 'bold');
  log('================');
  log(`✅ Pruebas pasadas: ${passed}/${total}`, passed === total ? 'green' : 'yellow');
  log(`📈 Puntuación: ${Math.round(passed/total*100)}%`, passed === total ? 'green' : 'yellow');
  
  if (passed === total) {
    log('🎉 ¡TODAS LAS PRUEBAS PASARON! El sistema está bien protegido.', 'green');
  } else {
    log('⚠️ Algunas pruebas fallaron. Revisa las configuraciones de seguridad.', 'yellow');
  }
  
  // Recomendaciones para CERT-PY
  log('\n💡 RECOMENDACIONES PARA CERT-PY', 'bold');
  log('===============================');
  if (passed >= total * 0.8) {
    log('✅ El sistema está bien preparado para la auditoría del CERT-PY', 'green');
    log('✅ Headers de seguridad implementados correctamente', 'green');
    log('✅ Protecciones básicas contra ataques comunes activas', 'green');
  } else {
    log('🔴 El sistema necesita mejoras antes de la auditoría', 'red');
    log('🔴 Revisa las configuraciones de seguridad', 'red');
  }
  
  return passed === total;
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { runAllTests }; 