#!/usr/bin/env node

/**
 * Script de automatización de pruebas de seguridad
 * Usa OWASP ZAP CLI para realizar pruebas automatizadas
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuración
const CONFIG = {
  targetUrl: process.env.TARGET_URL || 'http://localhost:3000',
  zapPath: process.env.ZAP_PATH || 'zap-cli',
  reportDir: path.join(process.cwd(), 'security-reports'),
  scanTimeout: 300000, // 5 minutos
  apiKey: process.env.ZAP_API_KEY || 'your-api-key'
};

// Crear directorio de reportes si no existe
if (!fs.existsSync(CONFIG.reportDir)) {
  fs.mkdirSync(CONFIG.reportDir, { recursive: true });
}

// Función para ejecutar comandos
function runCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`Ejecutando: ${command}`);
    exec(command, { timeout: CONFIG.scanTimeout }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.warn(`Warning: ${stderr}`);
      }
      console.log(`Output: ${stdout}`);
      resolve(stdout);
    });
  });
}

// Función para generar timestamp
function getTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

// Pruebas de seguridad automatizadas
async function runSecurityTests() {
  const timestamp = getTimestamp();
  const reportFile = path.join(CONFIG.reportDir, `security-scan-${timestamp}.html`);
  const jsonReportFile = path.join(CONFIG.reportDir, `security-scan-${timestamp}.json`);

  console.log('🚀 Iniciando pruebas de seguridad automatizadas...');
  console.log(`🎯 URL objetivo: ${CONFIG.targetUrl}`);
  console.log(`📊 Reportes: ${CONFIG.reportDir}`);

  try {
    // 1. Iniciar ZAP
    console.log('\n1️⃣ Iniciando ZAP...');
    await runCommand(`${CONFIG.zapPath} start --api-key ${CONFIG.apiKey}`);

    // 2. Spider scan (descubrir URLs)
    console.log('\n2️⃣ Ejecutando spider scan...');
    await runCommand(`${CONFIG.zapPath} spider ${CONFIG.targetUrl} --api-key ${CONFIG.apiKey}`);

    // 3. Active scan (pruebas activas)
    console.log('\n3️⃣ Ejecutando active scan...');
    await runCommand(`${CONFIG.zapPath} active-scan ${CONFIG.targetUrl} --api-key ${CONFIG.apiKey}`);

    // 4. Generar reporte HTML
    console.log('\n4️⃣ Generando reporte HTML...');
    await runCommand(`${CONFIG.zapPath} report -o ${reportFile} -f html --api-key ${CONFIG.apiKey}`);

    // 5. Generar reporte JSON
    console.log('\n5️⃣ Generando reporte JSON...');
    await runCommand(`${CONFIG.zapPath} report -o ${jsonReportFile} -f json --api-key ${CONFIG.apiKey}`);

    // 6. Detener ZAP
    console.log('\n6️⃣ Deteniendo ZAP...');
    await runCommand(`${CONFIG.zapPath} shutdown --api-key ${CONFIG.apiKey}`);

    console.log('\n✅ Pruebas de seguridad completadas exitosamente!');
    console.log(`📄 Reporte HTML: ${reportFile}`);
    console.log(`📄 Reporte JSON: ${jsonReportFile}`);

    // Analizar resultados
    await analyzeResults(jsonReportFile);

  } catch (error) {
    console.error('\n❌ Error durante las pruebas de seguridad:', error);
    process.exit(1);
  }
}

// Analizar resultados del scan
async function analyzeResults(jsonReportFile) {
  try {
    const reportData = JSON.parse(fs.readFileSync(jsonReportFile, 'utf8'));
    
    console.log('\n📊 ANÁLISIS DE RESULTADOS:');
    console.log('========================');

    const alerts = reportData.site || [];
    const highAlerts = alerts.filter(alert => alert.risk === 'High');
    const mediumAlerts = alerts.filter(alert => alert.risk === 'Medium');
    const lowAlerts = alerts.filter(alert => alert.risk === 'Low');

    console.log(`🔴 Alertas CRÍTICAS: ${highAlerts.length}`);
    console.log(`🟡 Alertas MEDIAS: ${mediumAlerts.length}`);
    console.log(`🟢 Alertas BAJAS: ${lowAlerts.length}`);

    if (highAlerts.length > 0) {
      console.log('\n🔴 VULNERABILIDADES CRÍTICAS ENCONTRADAS:');
      highAlerts.forEach(alert => {
        console.log(`  - ${alert.name}: ${alert.description}`);
      });
    }

    if (mediumAlerts.length > 0) {
      console.log('\n🟡 VULNERABILIDADES MEDIAS ENCONTRADAS:');
      mediumAlerts.forEach(alert => {
        console.log(`  - ${alert.name}: ${alert.description}`);
      });
    }

    // Recomendaciones
    console.log('\n💡 RECOMENDACIONES:');
    if (highAlerts.length === 0 && mediumAlerts.length === 0) {
      console.log('✅ El sistema parece estar bien protegido contra vulnerabilidades comunes.');
    } else {
      console.log('⚠️ Se encontraron vulnerabilidades que deben ser corregidas antes de la auditoría.');
    }

  } catch (error) {
    console.error('Error analizando resultados:', error);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  runSecurityTests();
}

module.exports = { runSecurityTests }; 